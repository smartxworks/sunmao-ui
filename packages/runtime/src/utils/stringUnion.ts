import { TLiteral, Type } from "@sinclair/typebox";


export type IntoStringUnion<T> = {
    [K in keyof T]: T[K] extends string ? TLiteral<T[K]> : never;
};

export function StringUnion<T extends string[]>(values: [...T], options?: any) {
    return Type.KeyOf(
        Type.Object(
            values.reduce((prev, cur) => {
                prev[cur] = Type.Boolean();
                return prev;
            }, {} as Record<T[number], any>)
        ), {
        title: options?.title,
        description: options?.description,
        category: options?.category,
        weight: options?.weight
    }
    );
}