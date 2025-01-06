import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export const sessionExpiredLoginAlert = async (router: ReturnType<typeof useRouter>) => {
    const result = await Swal.fire({
        title: "Please login to continue.",
        text: "",
        icon: "error",
        showCancelButton: false, // Hide the cancel button
        confirmButtonText: "Confirm",
        allowOutsideClick: false, // Disable outside click
        allowEscapeKey: false, // Disable Esc key
    });

    if (result.isConfirmed) {
        router.push("/login")
    }
};