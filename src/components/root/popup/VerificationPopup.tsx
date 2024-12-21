"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { API_PATH } from "@/constants/apiConstant";
import {
  userVerificationPopupStore,
  useUserStore,
} from "@/GlobalStore/userStore";
import { useApiCall } from "@/helpers/axiosWrapper";
import { useToast } from "@/hooks/use-toast";
import { Cross1Icon } from "@radix-ui/react-icons";

function VerificationPopup() {
  const { showUserVerificationModal, setShowUserVerificationModal } = userVerificationPopupStore();
  const { user } = useUserStore();
  const { apiCall } = useApiCall(); // Accessing the apiCall function
  const { toast } = useToast();

  const verifyUser = async () => {
    await apiCall({
      url: API_PATH.user.sendmail,
      method: "POST",
      data: { userId: user?._id },
    })
      .then((res) => {
        toast({
          title: "Verification email sent",
          description: "Please check your email for verification",
        });
      })
  };

  return (
    <AlertDialog open={showUserVerificationModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-between">
            <AlertDialogTitle>Verification needed</AlertDialogTitle>
            <Cross1Icon
              color="black"
              height={20}
              width={20}
              className="cursor-pointer hover:scale-125"
              onClick={() => setShowUserVerificationModal(false)}
            />
          </div>
          <AlertDialogDescription>
            Please verify your email address to like / comment on post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <button
            className="bg-green-500 w-full my-2 text-white p-2 text-sm rounded-md hover:bg-green-600 transition"
            onClick={verifyUser}
          >
            Verify
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default VerificationPopup;
