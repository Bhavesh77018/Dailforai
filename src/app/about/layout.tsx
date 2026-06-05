import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About DialforAI | The Future of Autonomous Intelligence",
  description: "Learn about DialforAI, the premium Agent OS that deploys autonomous AI workers to scale your recruitment, discover prospects, and accelerate outbound sales.",
  alternates: {
    canonical: 'https://www.dialforai.com/about',
  },
  openGraph: {
    title: "About DialforAI | Autonomous Intelligence",
    description: "Learn about DialforAI, the premium Agent OS that deploys autonomous AI workers to scale your recruitment and accelerate outbound sales.",
    url: "https://www.dialforai.com/about",
  }
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
