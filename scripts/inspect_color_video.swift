import AVFoundation
import AppKit

guard CommandLine.arguments.count >= 3 else { exit(2) }
let asset = AVURLAsset(url: URL(fileURLWithPath: CommandLine.arguments[1]))
let output = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
let generator = AVAssetImageGenerator(asset: asset)
generator.appliesPreferredTrackTransform = true
generator.maximumSize = NSSize(width: 438, height: 270)
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = .zero
let step = CommandLine.arguments.count > 3 ? (Double(CommandLine.arguments[3]) ?? 5) : 5
let ranges: [(Double, Double)] = CommandLine.arguments.count > 5
    ? [(Double(CommandLine.arguments[4]) ?? 945, Double(CommandLine.arguments[5]) ?? 1120)]
    : [(945, 1120), (1940, 2050), (2660, 2790)]
for (start, end) in ranges {
    for second in stride(from: start, through: end, by: step) {
        let time = CMTime(seconds: second, preferredTimescale: 600)
        let image = try generator.copyCGImage(at: time, actualTime: nil)
        let bitmap = NSBitmapImageRep(cgImage: image)
        var dark = 0
        var sampled = 0
        if let bytes = bitmap.bitmapData {
            let pixelsWide = bitmap.pixelsWide
            let pixelsHigh = bitmap.pixelsHigh
            for y in stride(from: 0, to: pixelsHigh, by: 4) {
                for x in stride(from: 0, to: pixelsWide, by: 4) {
                    let offset = y * bitmap.bytesPerRow + x * bitmap.bitsPerPixel / 8
                    let b = Int(bytes[offset])
                    let g = Int(bytes[offset + 1])
                    let r = Int(bytes[offset + 2])
                    if r + g + b < 90 { dark += 1 }
                    sampled += 1
                }
            }
        }
        let data = bitmap.representation(using: .jpeg, properties: [.compressionFactor: 0.75])!
        let whole = Int(second)
        let tenth = Int((second - Double(whole)) * 10)
        let name = String(format: "%02d-%02d-%01d.jpg", whole / 60, whole % 60, tenth)
        try data.write(to: output.appendingPathComponent(name))
        let darkRatio = sampled == 0 ? 0 : Double(dark) / Double(sampled)
        if darkRatio > 0.35 { print(String(format: "%.1f\t%.3f\t%@", second, darkRatio, name)) }
    }
}
