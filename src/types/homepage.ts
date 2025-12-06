export interface CategoryTile {
  slug: string;
  title: string;
  previewImage: string;
  backgroundBokeh: string;
}

export type TileState = 'active' | 'inactive' | 'default';
