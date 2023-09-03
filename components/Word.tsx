
export type WordProps = {
    id: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    unfamiliarWord?: {
        meaningFamiliarLevel: number;
        pronunciationFamiliarLevel: number;
        createdAt: string;
        updatedAt: string;
    }
};


