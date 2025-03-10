import { useSelf, useMutation } from "@/liveblocks.config";




export const useDeleteLayers = () => {
  const selection = useSelf((me) => me.presence.selection);
  const copiedElement = useSelf((me) => me.presence.copiedElement);

  return useMutation((
    { storage, setMyPresence }
  ) => {
    const liveLayers = storage.get("layers");
    const liveLayerIds = storage.get("layerIds");

    for (const id of selection) {
      liveLayers.delete(id);

      const index = liveLayerIds.indexOf(id);

      if (index !== -1) {
        liveLayerIds.delete(index);
      }
    }
    if (copiedElement == null) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, [selection, copiedElement]);
};