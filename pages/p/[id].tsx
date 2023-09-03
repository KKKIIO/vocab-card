import React from "react"
import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import { WordProps } from "../../components/Word"
import prisma from "../../lib/prisma"

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const word = await prisma.word.findUnique({
    where: {
      id: Number(params?.id),
    },
    include: {
      unfamiliarWord: true,
      examples: true,
    }
  })

  return {
    props: {
      ...word,
      createdAt: word.createdAt.toISOString(),
      updatedAt: word.updatedAt.toISOString(),
      unfamiliarWord: (word.unfamiliarWord) && {
        ...word.unfamiliarWord,
        createdAt: word.unfamiliarWord.createdAt.toISOString(),
        updatedAt: word.unfamiliarWord.updatedAt.toISOString(),
      },
      examples: word.examples.map((example) => ({
        ...example,
        createdAt: example.createdAt.toISOString(),
        updatedAt: example.updatedAt.toISOString(),
      })),
    },
  }
}

const Word: React.FC<WordProps> = (props) => {
  let title = props.text
  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>Add at {props.createdAt}</p>
        <p>Meaning unfamiliar level: {props.unfamiliarWord?.meaningFamiliarLevel}</p>
        <p>Pronunciation unfamiliar level: {props.unfamiliarWord?.pronunciationFamiliarLevel}</p>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default Word
