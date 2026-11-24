import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

export const Unauthorized = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-destructive">
            Unauthorized Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          You do not have access to this page. If you believe this is a mistake,
          contact the Portfolio team for assistance.
        </CardContent>
      </Card>
    </div>
  );
};
