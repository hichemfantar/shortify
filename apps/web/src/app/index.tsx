import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Copy, GithubIcon, InfoIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type UrlSchema = {
  id: string;
  shortId: string;
  longUrl: string;
  createdAt: string;
  shortUrl: string;
};

export default function ShortenUrl() {
  const [longUrl, setLongUrl] = useState("https://github.com/hichemfantar");
  const { width, height } = useWindowSize();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const shortenMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await axios.post(`${API_BASE_URL}/shorten`, {
        longUrl: url,
      });
      return response.data.shortUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
    },
  });

  const urlsQuery = useQuery({
    queryKey: ["urls"],
    queryFn: async () => {
      const response = await axios.get<UrlSchema[]>(`${API_BASE_URL}/urls`);
      return response.data;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (longUrl) {
      try {
        shortenMutation.mutate(longUrl);
      } catch (error) {
        toast({
          title: "Failed to shorten URL",
        });
      }
    }
  };
  return (
    <>
      <div className="flex min-h-dvh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <div className={cn("flex flex-col gap-6")}>
            <Card className="overflow-hidden">
              <CardContent className="grid p-6 md:p-8 md:grid-cols-2 gap-y-2 md:gap-8">
                {import.meta.env.PROD && (
                  <div className="md:col-span-full">
                    <Alert className="">
                      <InfoIcon className="h-4 w-4" />
                      <AlertTitle>Serverless Cold Start</AlertTitle>
                      <AlertDescription>
                        The first request may take longer due to a cold start,
                        as the serverless function needs to initialize after
                        being idle.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                      <h1 className="text-2xl font-bold">Shortify</h1>
                      <p className="text-balance text-muted-foreground">
                        Shorter links for a longer life
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="url">Give us a link</Label>
                      <Input
                        id="url"
                        required
                        type="url"
                        className="border p-2 rounded-md"
                        placeholder="Enter a long URL..."
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                      />
                    </div>
                    <Button
                      disabled={shortenMutation.isPending}
                      type="submit"
                      className="w-full"
                    >
                      {shortenMutation.isPending
                        ? "Shortening..."
                        : "Shorten URL"}
                    </Button>
                    {shortenMutation.data && (
                      <div className="flex items-center gap-4">
                        <div className="flex-1 grid gap-2">
                          <div className="flex items-center">
                            <Label htmlFor="shortened_url">Shortened URL</Label>
                          </div>
                          <a
                            href={shortenMutation.data}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline break-all"
                          >
                            {shortenMutation.data}
                          </a>
                        </div>
                        <Button
                          type="button"
                          variant={"ghost"}
                          size={"icon"}
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(
                                shortenMutation.data,
                              );
                              toast({
                                title: "Copied to clipboard",
                              });
                            } catch (error) {
                              toast({
                                title: "Failed to copy",
                              });
                            }
                          }}
                        >
                          <Copy />
                        </Button>
                      </div>
                    )}
                    <div className="grid">
                      <Button asChild variant="outline" className="">
                        <a
                          href="https://github.com/hichemfantar/shortify"
                          target="_blank"
                        >
                          <GithubIcon />
                          <span>Open on GitHub</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                </form>
                <div className="hidden bg-muted md:block">
                  <div className="p-10 mx-auto h-full w-full bg-white dark:invert flex justify-center items-center">
                    {shortenMutation.data ? (
                      <QRCodeSVG
                        value={shortenMutation.data}
                        title="Code"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        className="animate-bounce object-contain"
                        src="https://static.wikia.nocookie.net/mario/images/9/99/Mystery_Box_Art_-_Super_Mario_3D_Land.png"
                      ></img>
                    )}
                  </div>
                </div>
                <div className="hidden md:block col-span-full">
                  <List urls={urlsQuery.data || []} />
                </div>
              </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
              Built with ❤️ using{" "}
              <a href="https://react.dev/" target="_blank">
                React
              </a>
              ,{" "}
              <a href="https://expressjs.com/" target="_blank">
                Express
              </a>
              ,{" "}
              <a href="https://tanstack.com/query/latest" target="_blank">
                TanStack Query
              </a>
              , and{" "}
              <a href="https://turbo.build/" target="_blank">
                Turborepo
              </a>
              .
            </div>
          </div>{" "}
        </div>
      </div>
      {shortenMutation.isSuccess && (
        <ReactConfetti width={width} height={height} numberOfPieces={80} />
      )}
    </>
  );
}

function List({ urls }: { urls: UrlSchema[] }) {
  return (
    <Table>
      <TableCaption>A list of your links.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Long URL</TableHead>
          <TableHead>Short URL</TableHead>
          <TableHead className="text-right">Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {urls.map((url) => (
          <TableRow key={url.id}>
            <TableCell>
              <a href={url.longUrl} target="_blank" className="underline">
                {url.longUrl}
              </a>
            </TableCell>
            <TableCell>
              <a href={url.shortUrl} target="_blank" className="underline">
                {url.shortUrl}
              </a>
            </TableCell>
            <TableCell className="text-right">{url.createdAt}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Display limit</TableCell>
          <TableCell className="text-right">10</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
