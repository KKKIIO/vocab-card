import React from "react";
import Router from "next/router";

export type UnfamiliarWordProps = {
  id: string;
  wordId: number;
  word: {
    text: string;
  };
  meaningFamiliarLevel: number;
  pronunciationFamiliarLevel: number;
  createdAt: string;
  updatedAt: string;
};

const UnfamiliarWord: React.FC<{ unfamiliarWord: UnfamiliarWordProps }> = ({ unfamiliarWord }) => {
  return (
    <div onClick={() => Router.push("/p/[id]", `/p/${unfamiliarWord.wordId}`)}>
      <h2>{unfamiliarWord.word.text}</h2>
      <small>Add at {unfamiliarWord.createdAt}</small>
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default UnfamiliarWord;
