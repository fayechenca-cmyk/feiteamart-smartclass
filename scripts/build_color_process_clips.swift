import AVFoundation
import Foundation

struct ClipPlan {
    let name: String
    let speed: Double
    let ranges: [(Double, Double)]
    let crop: CGRect
}

guard CommandLine.arguments.count == 3 || CommandLine.arguments.count == 4 else {
    fputs("usage: build_color_process_clips <source.mp4> <output-directory> [filename]\n", stderr)
    exit(2)
}

let sourceURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputDirectory = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
try FileManager.default.createDirectory(at: outputDirectory, withIntermediateDirectories: true)
let sourceAsset = AVURLAsset(url: sourceURL)
guard let sourceVideo = sourceAsset.tracks(withMediaType: .video).first else {
    fputs("source has no video track\n", stderr)
    exit(3)
}

let plans = [
    ClipPlan(name: "value-process.mp4", speed: 2.0, ranges: [
        (15 * 60 + 45, 15 * 60 + 55),
        (15 * 60 + 59, 16 * 60 + 31),
        (16 * 60 + 33.5, 17 * 60 + 20.5),
        (17 * 60 + 24, 17 * 60 + 50),
        (17 * 60 + 53.5, 18 * 60 + 30)
    ], crop: CGRect(x: 360, y: 220, width: 540, height: 340)),
    ClipPlan(name: "neighbor-process.mp4", speed: 3.0, ranges: [
        (25 * 60 + 50, 27 * 60 + 20),
        (35 * 60, 39 * 60 + 20),
        (47 * 60, 49 * 60 + 20)
    ], crop: CGRect(x: 145, y: 60, width: 650, height: 440)),
    ClipPlan(name: "complement-process.mp4", speed: 3.0, ranges: [
        (39 * 60 + 30, 44 * 60 + 20),
        (49 * 60 + 20, 54 * 60)
    ], crop: CGRect(x: 145, y: 60, width: 650, height: 440))
]

for plan in plans {
    if CommandLine.arguments.count == 4 && CommandLine.arguments[3] != plan.name { continue }
    let composition = AVMutableComposition()
    guard let videoTrack = composition.addMutableTrack(withMediaType: .video,
                                                        preferredTrackID: kCMPersistentTrackID_Invalid) else {
        throw NSError(domain: "ColorProcess", code: 1)
    }
    videoTrack.preferredTransform = sourceVideo.preferredTransform
    var cursor = CMTime.zero
    for (startSeconds, endSeconds) in plan.ranges {
        let sourceRange = CMTimeRange(
            start: CMTime(seconds: startSeconds, preferredTimescale: 600),
            duration: CMTime(seconds: endSeconds - startSeconds, preferredTimescale: 600)
        )
        try videoTrack.insertTimeRange(sourceRange, of: sourceVideo, at: cursor)
        let fastDuration = CMTimeMultiplyByFloat64(sourceRange.duration, multiplier: 1.0 / plan.speed)
        videoTrack.scaleTimeRange(CMTimeRange(start: cursor, duration: sourceRange.duration), toDuration: fastDuration)
        cursor = CMTimeAdd(cursor, fastDuration)
    }

    let outputURL = outputDirectory.appendingPathComponent(plan.name)
    try? FileManager.default.removeItem(at: outputURL)
    guard let exporter = AVAssetExportSession(asset: composition, presetName: AVAssetExportPresetMediumQuality) else {
        throw NSError(domain: "ColorProcess", code: 2)
    }
    exporter.outputURL = outputURL
    exporter.outputFileType = .mp4
    exporter.shouldOptimizeForNetworkUse = true
    let crop = plan.crop
    let videoComposition = AVMutableVideoComposition()
    videoComposition.renderSize = crop.size
    videoComposition.frameDuration = CMTime(value: 1, timescale: 30)
    let instruction = AVMutableVideoCompositionInstruction()
    instruction.timeRange = CMTimeRange(start: .zero, duration: cursor)
    let layerInstruction = AVMutableVideoCompositionLayerInstruction(assetTrack: videoTrack)
    let cropTransform = sourceVideo.preferredTransform.concatenating(
        CGAffineTransform(translationX: -crop.minX, y: -crop.minY)
    )
    layerInstruction.setTransform(cropTransform, at: .zero)
    instruction.layerInstructions = [layerInstruction]
    videoComposition.instructions = [instruction]
    exporter.videoComposition = videoComposition
    let semaphore = DispatchSemaphore(value: 0)
    exporter.exportAsynchronously { semaphore.signal() }
    semaphore.wait()
    guard exporter.status == .completed else {
        throw exporter.error ?? NSError(domain: "ColorProcess", code: 3)
    }
    let bytes = (try FileManager.default.attributesOfItem(atPath: outputURL.path)[.size] as? NSNumber)?.int64Value ?? 0
    print("\(plan.name)\t\(CMTimeGetSeconds(cursor)) sec\t\(bytes) bytes")
}
