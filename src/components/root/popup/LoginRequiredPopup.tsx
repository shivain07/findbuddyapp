"use client";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogHeader,

} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import {
    userLoginPopupStore
} from "@/GlobalStore/userStore";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

function LoginRequiredPopup() {
    const { showLoginPopup, setShowLoginPopup } = userLoginPopupStore();
    const router = useRouter();

    const redirectToUrl = (url: string) => {
        router.push(url);
        setShowLoginPopup(false);
    }

    return (
        <AlertDialog open={showLoginPopup}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex justify-between">
                        <AlertDialogTitle>Hey !</AlertDialogTitle>
                        <Cross1Icon
                            color="black"
                            height={20}
                            width={20}
                            className="cursor-pointer hover:scale-125"
                            onClick={() => setShowLoginPopup(false)}
                        />
                    </div>
                    <AlertDialogDescription>
                        Please login / signup to continue.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="w-full">
                        <Button
                            className="w-full bg-purple-500 hover:bg-purple-700 mb-2"
                            size={"lg"}
                            onClick={() => redirectToUrl("/login")}
                        >
                            Login
                        </Button>
                        <Button
                            className="w-full border-2 border-purple-500 hover:bg-purple-300"
                            size={"lg"}
                            variant={"ghost"}
                            onClick={() => redirectToUrl("/signup")}
                        >
                            Signup
                        </Button>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default LoginRequiredPopup;
