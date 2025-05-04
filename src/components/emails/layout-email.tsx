import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
} from "@react-email/components";
import type { ReactNode } from "react";

interface EmailLayoutProps {
  preview: string;
  children: ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-xl">
            <Section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              {children}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
