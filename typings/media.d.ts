export interface Media {
  type: string,
  id: string,
  width: number,
  height: number
}

export interface Filter {
  ids: Array<string>,
  subGalleries?: boolean
}
