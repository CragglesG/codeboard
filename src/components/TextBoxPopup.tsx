import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form as Form } from "react-router";

export default function TextBoxPopup({
  optionalMessage,
  btnOnClick,
  btnOnClickArgs,
}: {
  optionalMessage?: string;
  btnOnClick: (...args: any) => void;
  btnOnClickArgs?: any[];
}) {
  const [text, setText] = useState("");

  return (
    <Card className="textbox-popup grid gap-6">
      <CardHeader>
        {optionalMessage && <CardTitle>{optionalMessage}</CardTitle>}
      </CardHeader>
      <CardContent>
        <Form className="flex flex-col gap-6">
          <Input
            type="text"
            placeholder="Enter text"
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            type="submit"
            onClick={() => {
              btnOnClick(...btnOnClickArgs, text);
            }}
          >
            Submit
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
