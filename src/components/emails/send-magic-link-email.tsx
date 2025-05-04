import { Button, Text } from "@react-email/components";
import { EmailLayout } from "./layout-email";

export const SendMagicLinkEmail = ({
  username,
  url,
  token,
}: {
  username: string;
  url: string;
  token: string;
}) => {
  return (
    <EmailLayout preview="Your magic link to sign in">
      <Text className="text-2xl font-bold text-gray-800">Magic Link</Text>
      <Text className="text-gray-600">Hi {username},</Text>
      <Text className="text-gray-600">
        Please click the button below to sign in:
      </Text>
      <Button
        className="bg-blue-600 text-white font-medium px-6 py-3 rounded-md"
        href={url}
      >
        Sign In
      </Button>
      <Text className="text-gray-600 mt-4">
        Or copy and paste this link in your browser:
      </Text>
      <Text className="text-blue-600 font-medium break-all">{url}</Text>
      <Text className="text-gray-500 text-sm mt-6">
        If you didn't request this magic link, you can safely ignore this email.
      </Text>
    </EmailLayout>
  );
};
