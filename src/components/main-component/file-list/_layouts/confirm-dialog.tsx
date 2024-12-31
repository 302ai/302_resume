import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ConfirmDialog = (props: {
  title: string;
  description: string;
  action: string;
  cancel: string;
  children: React.ReactNode;
  onConfirm: () => void;
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <button className="flex w-full flex-row items-center">
        {props.children}
      </button>
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
      <AlertDialogContent className="data-[state=open]:animate-contentShow fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-background p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        <AlertDialogTitle className="text-mauve12 m-0 text-[17px] font-medium">
          {props.title}
        </AlertDialogTitle>
        <AlertDialogDescription className="text-mauve11 mb-5 mt-[15px] text-[15px] leading-normal">
          {props.description}
        </AlertDialogDescription>
        <div className="flex justify-end gap-[25px]">
          <AlertDialogCancel asChild>
            <button className="bg-mauve4 text-mauve11 hover:bg-mauve5 inline-flex h-[35px] items-center justify-center rounded px-[15px] font-medium leading-none outline-none">
              {props.cancel}
            </button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <button
              onClick={props.onConfirm}
              className="bg-red4 text-red11 hover:bg-red5 inline-flex h-[35px] items-center justify-center rounded px-[15px] font-medium leading-none outline-none"
            >
              {props.action}
            </button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialog>
);

export default ConfirmDialog;
