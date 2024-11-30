import Image from "next/image";
import { Button } from "@/components/ui/Button";

const Footer = () => {
  return (
    <footer className="hidden h-20 w-full border-t-2 border-slate-200 p-2 lg:block">
      <div className="mx-auto flex h-full max-w-screen-lg items-center justify-evenly">
        <Button
          size="lg"
          variant="defaultOutline"
          className="w-full cursor-default hover:bg-transparent"
        >
          <Image
            src="/ma.svg"
            alt="Croatian"
            height={0}
            width={0}
            className="mr-4 rounded-md"
            style={{ height: "32px", width: "32px" }}
          />
          Moroccan Darija
        </Button>

        <Button
          size="lg"
          variant="defaultOutline"
          className="w-full cursor-default hover:bg-transparent"
        >
          <Image
            src="/es.svg"
            alt="Spanish"
            height={0}
            width={0}
            className="mr-4 rounded-md"
            style={{ height: "32px", width: "32px" }}
          />
          Spanish
        </Button>

        <Button
          size="lg"
          variant="defaultOutline"
          className="w-full cursor-default hover:bg-transparent"
        >
          <Image
            src="/fr.svg"
            alt="French"
            height={0}
            width={0}
            className="mr-4 rounded-md"
            style={{ height: "32px", width: "32px" }}
          />
          French
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
