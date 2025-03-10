import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuShortcut } from "./ui/context-menu"


interface ActionsProps {
    children: React.ReactNode;
    id?: string;
    title?: string;
    home?: boolean;
};

export const ContextMenuBox = ({ children, id, title, home }: ActionsProps) => {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild >
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem>Copy <ContextMenuShortcut>⌘</ContextMenuShortcut>C</ContextMenuItem>
                <ContextMenuItem>Cut <ContextMenuShortcut>⌘</ContextMenuShortcut>X</ContextMenuItem>
                <ContextMenuItem>Paste <ContextMenuShortcut>⌘</ContextMenuShortcut>V</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}