"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Octokit } from "octokit";

const FormSchema = z.object({
  text: z.string().default(""),
});

export function InputForm() {
  const [output, setOutput] = useState("");
  const [prevResponse, setPrevResponse] = useState("");
  const octokit = new Octokit({});

  const generateText = async (userInput: string) => {
    try {
      const input = `what is the meaning of '${userInput}'. please describe in to english, and please provide example`;
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: input }),
      });
      const data = await response.json();
      //  If successful, updates the output state with the output field from the response data

      if (response.ok) {
        const markdown = await octokit.request("POST /markdown", {
          text: data.output,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
        setOutput(markdown.data);
        if (output) {
          setPrevResponse(output);
        }
      } else {
        setOutput(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    generateText(data.text);
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>describer</FormLabel>
                <FormControl>
                  <Input placeholder="text" {...field} />
                </FormControl>
                <FormDescription>please input text</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <p dangerouslySetInnerHTML={{ __html: output }}></p>
      <h1 className="my-10">prev Response</h1>
      <p dangerouslySetInnerHTML={{ __html: prevResponse }}></p>
    </div>
  );
}
