import { Button, Text } from "@react-email/components";
import { EmailLayout } from "./layout-email";

export const ResetPasswordEmail = ({
  resetLink,
  username,
}: {
  resetLink: string;
  username: string;
}) => {
  return (
    <EmailLayout preview="Reset your password">
      <Text className="text-2xl font-bold text-gray-800">
        Reset Your Password
      </Text>
      <Text className="text-gray-600">Hi {username},</Text>
      <Text className="text-gray-600">
        Click the button below to reset your password:
      </Text>
      <Button
        className="bg-blue-600 text-white font-medium px-6 py-3 rounded-md"
        href={resetLink}
      >
        Reset Password
      </Button>
      <Text className="text-gray-500 text-sm mt-6">
        If you didn't request a password reset, you can safely ignore this
        email.
      </Text>
    </EmailLayout>
  );
};
