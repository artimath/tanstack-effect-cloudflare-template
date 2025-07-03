import { Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/intl/react";

export function InvitationError() {
  const { t } = useTranslation();

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <CardTitle className="text-destructive text-xl">{t("INVITATION_ERROR")}</CardTitle>
        </div>
        <CardDescription>{t("INVITATION_ERROR_DESC")}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-muted-foreground text-sm">{t("INVITATION_ERROR_MESSAGE")}</p>
      </CardContent>
      <CardFooter>
        <Link to="/" className="w-full">
          <Button variant="outline" className="w-full">
            {t("GO_HOME")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
