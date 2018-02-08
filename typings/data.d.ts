
export type Tags = { [tag: string]: number };

export type Categories = { [categoryPath: string]: number };

export interface Document {
  id: string;
  attributes: {
    draft?: boolean,
    title?: string,
    date?: Date,
    tags?: Array<string>,
    categories?: Array<string | Array<string>>
    [key: string]: any
  };
  body?: string;
}
