import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, FabricText, FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Brush, 
  Eraser, 
  Copy, 
  Heart, 
  Type, 
  Upload, 
  Download, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Eye,
  Layers,
  Settings
} from "lucide-react";
import { toast } from "sonner";

type Tool = "select" | "brush" | "eraser" | "clone" | "heal" | "text" | "bubble";

export const MangaEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [brushSize, setBrushSize] = useState(5);
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string>("");

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: Math.min(window.innerWidth - 400, 800),
      height: Math.min(window.innerHeight - 200, 600),
      backgroundColor: "#1a1a1a",
    });

    canvas.freeDrawingBrush.color = "#ffffff";
    canvas.freeDrawingBrush.width = brushSize;

    setFabricCanvas(canvas);
    toast("🎨 MangaEdit Pro ready! Upload an image to start editing.");

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "brush";
    
    if (activeTool === "brush" && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = "#ffffff";
      fabricCanvas.freeDrawingBrush.width = brushSize;
    }

    fabricCanvas.defaultCursor = activeTool === "eraser" ? "crosshair" : "default";
  }, [activeTool, brushSize, fabricCanvas]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      FabricImage.fromURL(e.target?.result as string).then((img) => {
        const canvasWidth = fabricCanvas.width!;
        const canvasHeight = fabricCanvas.height!;
        const imgWidth = img.width!;
        const imgHeight = img.height!;
        
        const scaleX = canvasWidth / imgWidth;
        const scaleY = canvasHeight / imgHeight;
        const scale = Math.min(scaleX, scaleY, 1); // Don't upscale
        
        img.set({
          scaleX: scale,
          scaleY: scale,
          left: (canvasWidth - imgWidth * scale) / 2,
          top: (canvasHeight - imgHeight * scale) / 2,
        });
        
        fabricCanvas.add(img);
        fabricCanvas.sendObjectToBack(img);
        fabricCanvas.renderAll();
        toast("📷 Image loaded successfully!");
      });
    };
    reader.readAsDataURL(file);
  };

  const performOCR = async () => {
    if (!fabricCanvas) return;
    
    setIsOCRProcessing(true);
    toast("🔍 Analyzing Japanese text...");

    try {
      const imageData = fabricCanvas.toDataURL({
        multiplier: 1,
        format: 'jpeg' as const,
        quality: 0.8
      });
      
      // Simulate OCR processing - in real implementation, you'd use a proper Japanese OCR service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockJapaneseText = "こんにちは！これはサンプルテキストです。\n漫画のテキスト認識が正常に動作しています。\n\n検出されたテキスト:\n• セリフ1: おはよう！\n• セリフ2: 今日はいい天気ですね\n• ナレーション: 朝の風景";
      setExtractedText(mockJapaneseText);
      toast("✅ Japanese text extracted successfully!");
    } catch (error) {
      toast("❌ OCR processing failed. Please try again.");
      console.error('OCR Error:', error);
    } finally {
      setIsOCRProcessing(false);
    }
  };

  const addTextBubble = () => {
    if (!fabricCanvas) return;

    const textBubble = new Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 2,
    });

    const text = new FabricText("テキスト", {
      left: 75,
      top: 85,
      fontSize: 16,
      fill: "#000000",
      fontFamily: "Arial",
    });

    fabricCanvas.add(textBubble, text);
    fabricCanvas.renderAll();
    toast("💬 Text bubble added!");
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#1a1a1a";
    fabricCanvas.renderAll();
    toast("🗑️ Canvas cleared!");
  };

  const exportImage = () => {
    if (!fabricCanvas) return;
    const dataURL = fabricCanvas.toDataURL({
      multiplier: 2,
      format: 'png' as const,
      quality: 1
    });
    const link = document.createElement('a');
    link.download = 'manga-edit.png';
    link.href = dataURL;
    link.click();
    toast("💾 Image exported successfully!");
  };

  const tools = [
    { name: "brush", icon: Brush, variant: "brush" as const, label: "Brush" },
    { name: "eraser", icon: Eraser, variant: "eraser" as const, label: "Eraser" },
    { name: "clone", icon: Copy, variant: "clone" as const, label: "Clone" },
    { name: "heal", icon: Heart, variant: "heal" as const, label: "Heal" },
    { name: "text", icon: Type, variant: "tool" as const, label: "Text" },
  ];

  return (
    <div className="h-screen bg-background flex no-select">
      {/* Left Toolbar */}
      <Card className="w-20 h-full gradient-panel border-r border-border/50 rounded-none flex flex-col items-center py-4 gap-2">
        {tools.map((tool) => (
          <Button
            key={tool.name}
            variant={activeTool === tool.name ? tool.variant : "ghost"}
            size="tool"
            onClick={() => setActiveTool(tool.name as Tool)}
            title={tool.label}
            className="transition-smooth"
          >
            <tool.icon className="h-5 w-5" />
          </Button>
        ))}
        
        <div className="flex-1" />
        
        <Button
          variant="panel"
          size="tool"
          onClick={() => document.getElementById('image-upload')?.click()}
          title="Upload Image"
        >
          <Upload className="h-5 w-5" />
        </Button>
        
        <Button
          variant="panel"
          size="tool"
          onClick={performOCR}
          disabled={isOCRProcessing}
          title="Japanese OCR"
        >
          <Eye className="h-5 w-5" />
        </Button>
        
        <Button
          variant="panel"
          size="tool"
          onClick={addTextBubble}
          title="Add Text Bubble"
        >
          <Type className="h-5 w-5" />
        </Button>
      </Card>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <Card className="h-16 gradient-panel border-b border-border/50 rounded-none flex items-center px-4 gap-4">
          <div className="flex items-center gap-2">
            <Button variant="panel" size="sm" onClick={() => toast("Undo feature coming soon!")}>
              <RotateCcw className="h-4 w-4" />
              Undo
            </Button>
            <Button variant="panel" size="sm" onClick={() => toast("Redo feature coming soon!")}>
              <RotateCcw className="h-4 w-4 scale-x-[-1]" />
              Redo
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="panel" size="sm" onClick={() => toast("Zoom out coming soon!")}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">100%</span>
            <Button variant="panel" size="sm" onClick={() => toast("Zoom in coming soon!")}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20 accent-primary"
            />
            <span className="text-sm text-muted-foreground w-8">{brushSize}px</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="panel" size="sm" onClick={clearCanvas}>
              Clear
            </Button>
            <Button variant="default" size="sm" onClick={exportImage}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </Card>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center bg-manga-shadow p-4 overflow-hidden">
          <div className="border border-border/30 rounded-lg shadow-2xl overflow-hidden glow-primary">
            <canvas ref={canvasRef} className="max-w-full max-h-full" />
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <Card className="w-80 h-full gradient-panel border-l border-border/50 rounded-none flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border/50 flex-shrink-0">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Layers className="h-5 w-5" />
            OCR & Tools
          </h2>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          <div>
            <h3 className="text-sm font-medium mb-2 text-primary">Japanese OCR Results</h3>
            <div className="bg-manga-panel rounded-lg p-3 min-h-[120px] text-sm border border-border/20">
              {isOCRProcessing ? (
                <div className="flex items-center justify-center h-20">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2 text-xs text-muted-foreground">Processing...</span>
                </div>
              ) : extractedText ? (
                <p className="text-manga-text whitespace-pre-wrap leading-relaxed">{extractedText}</p>
              ) : (
                <p className="text-muted-foreground">Upload a manga image and click the OCR button to extract Japanese text.</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2 text-primary">Manga Tools</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => toast("Feature coming soon!")}>
                <Settings className="h-4 w-4" />
                Auto Remove Text Bubbles
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => toast("Feature coming soon!")}>
                <Brush className="h-4 w-4" />
                Smart Background Clean
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => toast("Feature coming soon!")}>
                <Type className="h-4 w-4" />
                Detect Speech Bubbles
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => toast("Feature coming soon!")}>
                <Copy className="h-4 w-4" />
                Clone Tool (Patch)
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2 text-primary">Export Options</h3>
            <div className="space-y-2">
              <Button variant="secondary" size="sm" className="w-full justify-start" onClick={exportImage}>
                <Download className="h-4 w-4" />
                Export as PNG
              </Button>
              <Button variant="secondary" size="sm" className="w-full justify-start" onClick={() => toast("JPG export coming soon!")}>
                <Download className="h-4 w-4" />
                Export as JPG
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Hidden file input */}
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};