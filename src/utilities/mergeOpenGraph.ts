import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Criamos experiências digitais futuristas e inclusivas com tecnologias de ponta.',
  images: [
    {
      url: `${getServerSideURL()}/monynha-og.jpg`,
    },
  ],
  siteName: 'Monynha Tech',
  title: 'Monynha Tech',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
