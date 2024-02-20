import { Button } from "@/components/ui/button";
import { Download, File, Image as Img } from "lucide-react";
import jsPDF from "jspdf";
import { useQuery } from "convex/react"


import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

interface ExportProps {
    boardId: string;
}


const Export = ({ boardId }: ExportProps) => {
    const data = useQuery(api.boards.get, { id: boardId as Id<"boards"> })

    const exportCanvas = (type: string) => {
        let svgCanvas = document.querySelector('.svgCanvas') as HTMLElement;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const svgData = new XMLSerializer().serializeToString(svgCanvas);
        const img = new Image();
        const svgSize = svgCanvas.getBoundingClientRect();
        canvas.width = svgSize.width;
        canvas.height = svgSize.height;
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.src = url;
        img.onload = () => {
            ctx?.drawImage(img, 0, 0);
            const png = canvas.toDataURL('image/png');
            if (type === 'png') {
                const downloadLink = document.createElement('a');
                downloadLink.href = png;
                downloadLink.download = `${data?.title}.png`;
                downloadLink.click();
            }
            if (type === "pdf") {
                const pdf = new jsPDF();
                pdf.addImage(png, 'PNG', 0, 0, 0, 0);
                pdf.save(`${data?.title}.pdf`);
            }
        }

    }

    return (
        <div className="bg-white rounded-md px-1.5 h-12 flex items-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="p-3 cursor-pointer text-sm w-full justify-start font-normal hover:bg-gray-100"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    onClick={(e) => e.stopPropagation()}
                    side={"bottom"}
                    sideOffset={10}
                    className="w-60"
                >
                    <DropdownMenuItem >
                        <Button onClick={() => exportCanvas('png')}
                            variant="ghost"
                            className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
                        >
                            <Img className="h-4 w-4 mr-2" />
                            PNG
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem >
                        <Button onClick={() => exportCanvas('pdf')}
                            variant="ghost"
                            className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
                        >
                            <File className="h-4 w-4 mr-2" />
                            PDF
                        </Button>
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
export default Export;