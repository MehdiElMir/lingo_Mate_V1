import Image from "next/image";
import { X } from "lucide-react";

import { Progress } from "@/components/ui";
import { useExitModal } from "@/store/use-exit-modal";

type HeaderProps = {
  hearts: number;
  percentage: number;
};

const Header = ({ hearts, percentage }: HeaderProps) => {
  const { open } = useExitModal();

  return (
    <header className="flex items-center justify-between max-w-[1140px] gap-x-7 mx-auto w-full px-6 md:px-10 pt-[20px] lg:pt-[50px]">
      <X
        onClick={open}
        className="text-slate-500 hover:opacity-75 transition cursor-pointer"
      />

      <Progress value={percentage} />

      <div className="flex items-center text-rose-500 font-bold">
        <Image
          src="/heart.svg"
          alt="Heart"
          height={28}
          width={28}
          className="mr-2"
        />
      </div>
    </header>
  );
};

export default Header;
