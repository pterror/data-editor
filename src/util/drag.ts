const image = new Image();
// Blank GIF
image.src =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export function removeDragImage(event: DragEvent) {
  event.dataTransfer?.setDragImage(image, 0, 0);
}
