// Mock dataModel for development purposes
export type Doc<T extends string> = {
  _id: Id<T>;
  _creationTime: number;
};

export class Id<T extends string> {
  private tableName: T;
  private id: string;

  constructor(tableName: T, id: string) {
    this.tableName = tableName;
    this.id = id;
  }

  static fromString<T extends string>(id: string): Id<T> {
    // For mock purposes, assuming the format is tableName:id
    const parts = id.split(':');
    if (parts.length !== 2) {
      throw new Error(`Invalid ID format: ${id}`);
    }
    return new Id(parts[0] as T, parts[1]);
  }

  toString(): string {
    return `${this.tableName}:${this.id}`;
  }
} 