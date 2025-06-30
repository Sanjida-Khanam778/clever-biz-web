import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  DateInput,
  InputImageUploadBox,
  InputVideoUploadBox,
  LabelInput,
  LabelTextarea,
  PickCompanyLogo,
} from "./input";
import {
  BtnBold,
  BtnItalic,
  BtnBulletList,
  ContentEditableEvent,
  Editor,
  Toolbar,
  BtnStyles,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnLink,
  BtnUndo,
  BtnRedo,
} from "react-simple-wysiwyg";
import { useEffect, useState } from "react";
import { set, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { ImSpinner6 } from "react-icons/im";
import { useOwner } from "@/context/ownerContext";
import { useRole } from "@/hooks/useRole";
import { FiX } from "react-icons/fi";

/* Edit food item dialog ===========================================================>>>>> */
type ModalProps = {
  isOpen: boolean;
  close: () => void;
  id?: number | null;
  onSuccess?: () => void;
};

export const EditFoodItemModal: React.FC<ModalProps> = ({
  isOpen,
  close,
  id,
  onSuccess,
}) => {
  type Inputs = {
    price: string;
    name: string;
    category: string;
    description: string;
  };
  const { categories, fetchCategories, updateFoodItem, createFoodItem } =
    useOwner();
  const { userRole, isLoading } = useRole();
  const { register, handleSubmit, reset, setValue } = useForm<Inputs>();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [existingVideo, setExistingVideo] = useState<string | null>(null);

  // Load categories when userRole is available
  useEffect(() => {
    if (!isLoading && userRole) {
      fetchCategories();
    }
  }, [userRole, isLoading, fetchCategories]);

  // Load single food item data if in edit mode
  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          let endpoint;
          // Use role-based API endpoint
          if (userRole === "owner") {
            endpoint = `/owners/items/${id}/`;
          } else if (userRole === "staff") {
            endpoint = `/staff/items/${id}/`;
          } else if (userRole === "chef") {
            endpoint = `/chef/items/${id}/`;
          } else {
            throw new Error("Invalid user role");
          }
       

          const res = await axiosInstance.get(endpoint);
          const item = res.data;
          console.log(item);
          reset({
            name: item.item_name,
            price: item.price,
            category: item.category.toString(),
            description: item.description,
          });
          // Set existing media files
          if (item.image1) {
            setExistingImage(item.image1);
          }
          if (item.video) {
            setExistingVideo(item.video);
          }
        } catch (err) {
          console.error("Failed to load item for edit", err);
          toast.error("Failed to load item.");
        }
      };
      fetchItem();
    } else {
      reset(); // clear form for create mode
      setImageFile(null);
      setVideoFile(null);
      setExistingImage(null);
      setExistingVideo(null);
    }
  }, [id, reset, userRole]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("item_name", data.name);
    formData.append("price", data.price.toString());
    formData.append("category", data.category);
    formData.append("description", data.description);

    if (imageFile) formData.append("image1", imageFile);
    if (videoFile) formData.append("video", videoFile);

    try {
      if (id) {
        // For edit mode, check if we have any media (new or existing)
        if (!imageFile && !existingImage) {
          setLoading(false);
          return toast.error(
            "Please upload an image or keep the existing one."
          );
        }
        if (!videoFile && !existingVideo) {
          setLoading(false);
          return toast.error("Please upload a video or keep the existing one.");
        }

        await updateFoodItem(id, formData);
      } else {
        // For create mode, require both image and video
        if (!imageFile) return toast.error("Please upload an image.");
        if (!videoFile) return toast.error("Please upload a video.");

        await createFoodItem(formData);
      }

      // Reset form and state
      reset();
      setImageFile(null);
      setVideoFile(null);
      setExistingImage(null);
      setExistingVideo(null);

      // Close modal
      close();
    } catch (err) {
      console.error("Failed to submit item", err);
      // Error handling is done in the context functions
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} as="div" className="relative z-10" onClose={close}>
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-xl rounded-xl bg-sidebar/80 p-6 backdrop-blur-xl">
            <DialogTitle className="text-base font-medium text-white mb-8">
              {id ? "Edit Food Item" : "Add New Food Item"}
            </DialogTitle>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-y-4"
            >
              <LabelInput
                label="Item Name"
                labelProps={{ className: "text-sm" }}
                inputProps={{
                  className: "bg-[#201C3F] shadow-md text-sm",
                  ...register("name", { required: true }),
                }}
              />
              <div className="flex gap-x-4">
                <div className="basis-[30%]">
                  <LabelInput
                    label="Price"
                    labelProps={{ className: "text-sm" }}
                    inputProps={{
                      className: "bg-[#201C3F] shadow-md text-sm",
                      type: "number",
                      ...register("price", { required: true }),
                    }}
                  />
                </div>
                <div className="basis-[70%]">
                  <label className="block text-sm text-white mb-1">
                    Food Category
                  </label>
                  <select
                    {...register("category", { required: true })}
                    className="bg-[#201C3F] shadow-md text-sm w-full px-3 py-2 rounded-md text-white"
                  >
                    <option value="">Select category</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.Category_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <LabelTextarea
                label="Description"
                labelProps={{ className: "text-sm" }}
                textareaProps={{
                  placeholder: "Enter here...",
                  rows: 6,
                  className: "bg-[#201C3F] shadow-md text-sm",
                  ...register("description", { required: true }),
                }}
              />

              {/* Show existing image if editing */}
              {existingImage && !imageFile && (
                <div className="space-y-4">
                  <label className="block text-primary-text text-sm font-medium">
                    Current Image
                  </label>
                  <div className="relative mt-4 inline-block">
                    <img
                      src={existingImage}
                      alt="Current image"
                      className="rounded-md max-h-60 object-contain border border-gray-600"
                    />
                    <button
                      onClick={() => setExistingImage(null)}
                      className="absolute top-1 right-1 p-1 bg-black bg-opacity-60 text-white rounded-full"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <InputImageUploadBox file={imageFile} setFile={setImageFile} />

              {/* Show existing video if editing */}
              {existingVideo && !videoFile && (
                <div className="space-y-4">
                  <label className="block text-primary-text text-sm font-medium">
                    Current Video
                  </label>
                  <div className="relative mt-4 inline-block">
                    <video
                      src={existingVideo}
                      controls
                      className="rounded-md max-h-60 object-contain border border-gray-600"
                    />
                    <button
                      onClick={() => setExistingVideo(null)}
                      className="absolute top-1 right-1 p-1 bg-black bg-opacity-60 text-white rounded-full"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <InputVideoUploadBox file={videoFile} setFile={setVideoFile} />
              <button className="button-primary" type="submit">
                {loading ? (
                  <span className="flex gap-3 items-center justify-center">
                    <ImSpinner6 className="animate-spin" /> Loading...
                  </span>
                ) : id ? (
                  "Update"
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

/* <<<<<<<<===================================================== Edit food item dialog */

/* Delete food item dialog ===========================================================>>>>> */
type DeleteFoodItemModalProps = ModalProps & {
  id?: number | null;
};

export const DeleteFoodItemModal: React.FC<DeleteFoodItemModalProps> = ({
  isOpen,
  close,
  id,
}) => {
  const { deleteFoodItem } = useOwner();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!id) {
      toast.error("No item selected for deletion.");
      return;
    }

    setLoading(true);
    try {
      await deleteFoodItem(id);
      close();
    } catch (err) {
      console.error("Failed to delete item", err);
      // Error handling is done in the context function
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={close}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/20" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-sidebar/80 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
              Delete Food Item
            </DialogTitle>
            <p className="mt-2 text-sm/6 text-white/50">
              Are you sure you want to delete this food item? This action cannot
              be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                onClick={close}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="button-primary inline-flex items-center gap-2 rounded-md py-2 px-4 text-sm/6 font-semibold text-white shadow-inner shadow-white/5 focus:outline-none data-[hover]:bg-red-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-red-700 bg-red-500 hover:bg-red-600"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ImSpinner6 className="animate-spin w-4 h-4" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

/* <<<<<<<<===================================================== Delete food item dialog */

/* Call Confirm Dialog ===========================================================>>>>> */
interface ModalConfirm extends ModalProps {
  confirm: () => void;
}
export const ModalCallConfirm: React.FC<ModalConfirm> = ({
  isOpen,
  close,
  confirm,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => close()}
      className="relative z-50 transition duration-300 ease-out data-[closed]:opacity-0"
      transition={true}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/10" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className=" bg-primary/90 p-4 rounded-lg shadow-xl min-w-lg">
          <div className="relative max-h-[300px] mx-auto aspect-square rounded-xl overflow-hidden flex flex-col justify-center items-center">
            <p className="text-lg text-primary-text text-center">
              Do you want to call the order table?
            </p>
            <div className="mt-8 flex flex-row justify-center items-center gap-x-16">
              <button onClick={() => close()} className="text-primary-text">
                Cancel
              </button>
              <button
                onClick={() => confirm()}
                className="button-primary px-8 py-3 text-primary-text"
              >
                Confirm
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
/* <<<<<<<<===================================================== Call Confirm Dialog */

/* Call dialog ===========================================================>>>>> */
export const ModalCall: React.FC<ModalProps> = ({ isOpen, close }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => close()}
      className="relative z-50 transition duration-300 ease-out data-[closed]:opacity-0"
      transition={true}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/10" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className=" bg-primary/90 p-4 rounded-lg shadow-xl min-w-lg">
          <div className="relative max-h-[300px] mx-auto aspect-square rounded-xl overflow-hidden flex flex-col justify-center items-center">
            <div className="flex flex-row gap-x-10">
              <svg
                width="51"
                height="51"
                viewBox="0 0 51 51"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="51" height="51" rx="25.5" fill="#1CC06C" />
                <path
                  d="M29.1485 28.4731L28.6177 29.0331C28.6177 29.0331 27.3542 30.3619 23.9067 26.7324C20.4592 23.1029 21.7227 21.7741 21.7227 21.7741L22.0575 21.4206C22.8812 20.5526 22.9593 19.1596 22.2395 18.1422L20.7695 16.0621C19.8782 14.8021 18.1573 14.6364 17.1365 15.7109L15.306 17.6371C14.8008 18.1702 14.4625 18.8597 14.5033 19.6262C14.6083 21.5862 15.446 25.8014 20.1173 30.7212C25.0722 35.9362 29.7213 36.1439 31.6218 35.9561C32.2238 35.8977 32.7465 35.5722 33.1677 35.1289L34.8243 33.3836C35.9443 32.2052 35.6293 30.1869 34.1967 29.3632L31.9683 28.0799C31.028 27.5397 29.8835 27.6984 29.1485 28.4719M26.4698 13.6937C26.4883 13.5803 26.5289 13.4715 26.5893 13.3738C26.6498 13.276 26.7289 13.1911 26.8222 13.1239C26.9155 13.0567 27.0211 13.0086 27.133 12.9823C27.2449 12.9559 27.3609 12.9519 27.4743 12.9704C27.5035 12.9762 27.5992 12.9937 27.6493 13.0054C27.7497 13.0264 27.8866 13.0614 28.06 13.1104C28.4065 13.2119 28.8907 13.3787 29.4717 13.6447C30.6337 14.1779 32.1795 15.1101 33.7848 16.7142C35.3902 18.3196 36.3223 19.8666 36.8555 21.0286C37.1215 21.6096 37.2872 22.0926 37.3887 22.4402C37.4395 22.615 37.4835 22.7917 37.5205 22.9699L37.5263 23.0061C37.5647 23.2371 37.5108 23.474 37.3761 23.6656C37.2415 23.8572 37.0369 23.9882 36.8065 24.0304C36.5781 24.0675 36.3442 24.0126 36.1562 23.8777C35.9681 23.7427 35.8412 23.5388 35.8032 23.3106C35.7788 23.1817 35.7473 23.0544 35.7087 22.9291C35.5894 22.5284 35.4413 22.1369 35.2653 21.7577C34.8103 20.7661 33.9913 19.3964 32.547 17.9521C31.1027 16.5077 29.7342 15.6899 28.7413 15.2349C28.3625 15.059 27.9714 14.9108 27.5712 14.7916C27.4484 14.7571 27.3247 14.7259 27.2002 14.6982C26.9711 14.6598 26.7663 14.533 26.6298 14.3452C26.4932 14.1574 26.4358 13.9234 26.4698 13.6937Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M26.7331 17.7185C26.7646 17.608 26.8175 17.5047 26.8889 17.4146C26.9603 17.3245 27.0487 17.2494 27.1492 17.1935C27.2496 17.1376 27.3601 17.102 27.4742 17.0888C27.5884 17.0756 27.7041 17.085 27.8146 17.1165L27.8181 17.1177L27.8216 17.1189L27.831 17.1212L27.8543 17.1282L27.9196 17.1515C27.9717 17.1694 28.0406 17.1966 28.1261 17.2332C28.2965 17.3055 28.5286 17.4175 28.8145 17.5867C29.385 17.925 30.1643 18.485 31.0801 19.402C31.996 20.3179 32.5571 21.0972 32.8955 21.6677C33.0646 21.9535 33.1766 22.1857 33.249 22.356C33.2877 22.4452 33.3227 22.5358 33.354 22.6279L33.3598 22.6512L33.3633 22.6605V22.664L33.3645 22.6652C33.3645 22.6652 33.3645 22.6675 32.5245 22.9079L33.3645 22.6675C33.4237 22.8883 33.3942 23.1235 33.2823 23.3228C33.1704 23.5221 32.9849 23.6697 32.7656 23.734C32.5463 23.7983 32.3105 23.7743 32.1086 23.667C31.9068 23.5597 31.755 23.3777 31.6856 23.1599L31.6821 23.1482L31.6413 23.0455C31.5669 22.8786 31.4827 22.7161 31.3893 22.559C31.1291 22.1204 30.659 21.4554 29.8423 20.6387C29.0256 19.822 28.3618 19.353 27.922 19.0929C27.733 18.982 27.5366 18.8845 27.334 18.8012L27.3223 18.7965C27.1019 18.7303 26.9165 18.5799 26.8062 18.3779C26.6959 18.1759 26.6697 17.9398 26.7331 17.7185Z"
                  fill="white"
                />
              </svg>

              <svg
                width="51"
                height="51"
                viewBox="0 0 51 51"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="51" height="51" rx="25.5" fill="#FE5050" />
                <path
                  d="M20.5115 27.9062L20.5056 27.1346C20.5056 27.1346 20.4944 25.301 25.4952 25.525C30.496 25.749 30.5073 27.5826 30.5073 27.5826L30.5112 28.0695C30.5198 29.2661 31.4295 30.3239 32.6536 30.5576L35.1553 31.0369C36.6713 31.3265 38.0259 30.2524 38.0162 28.7704L37.9992 26.1132C37.9934 25.3787 37.759 24.6473 37.198 24.1234C35.7631 22.7842 32.2364 20.3283 25.459 20.0233C18.2726 19.7023 14.7791 22.7769 13.5401 24.2303C13.1469 24.6898 12.9961 25.2867 13.0001 25.8982L13.0169 28.3046C13.0272 29.9302 14.6538 31.1659 16.2572 30.7657L18.7526 30.145C19.8047 29.882 20.5192 28.974 20.5123 27.907"
                  fill="white"
                />
              </svg>
            </div>
            <p className="text-primary-text/50 mt-8">Call time 00.30.30</p>
            <p className="text-primary-text">Outgoing call</p>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
/* <<<<<<<<===================================================== Call dialog */

/* Dialog Faq Editor ===========================================================>>>>> */
export const ModalFaqEditor: React.FC<ModalProps> = ({ isOpen, close }) => {
  const [html, setHtml] = useState(
    `Students can engage with the AI tutor in several ways for a seamless learning experience. They can: Type their questions directly into the chat interface: This is ideal for quick queries and specific problems. Upload homework or problem sets as an image: Our AI will analyze the image, identify the problems, and allow students to work through them with guidance. Potentially speak their questions: Our voice input allows for an even more natural interaction. The AI will then analyze the student's input, highlight any errors, and provide step-by-step correct solutions with clear explanations. This ensures the student not only gets the right answer but also understands the underlying concepts.`
  );

  function onChange(e: ContentEditableEvent) {
    setHtml(e.target.value);
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => close()}
      className="relative z-50 transition duration-300 ease-out data-[closed]:opacity-0"
      transition={true}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/10" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className=" bg-primary p-4 rounded-lg shadow-xl min-w-lg">
          <div className="flex flex-col justify-center items-stretch">
            <div className="flex flex-col max-h-120 overflow-y-auto scrollbar-hide max-w-xl">
              <LabelInput
                label="Question"
                inputProps={{
                  placeholder: "Faq question",
                }}
              />
              <label htmlFor="text" className="mt-2 text-primary-text">
                Answer
              </label>

              <Editor
                id="text"
                value={html}
                onChange={onChange}
                containerProps={{
                  className: "max-h-200",
                }}
                className="w-full border-none outline-nonew-full p-3 bg-input text-primary-text font-poppins placeholder:font-poppins placeholder:text-input-placeholder rounded-md focus:outline-none focus:ring-0"
              >
                <Toolbar className="bg-blue-300 flex items-center [&_svg]:mx-auto">
                  <BtnStyles />
                  <BtnBold />
                  <BtnItalic />
                  <BtnBulletList />
                  <BtnNumberedList />
                  <BtnStrikeThrough />
                  <BtnLink />
                  <BtnUndo />
                  <BtnRedo />
                </Toolbar>
              </Editor>
            </div>
            <div className="mt-8 flex flex-row justify-center items-center gap-x-16">
              <button
                onClick={() => confirm()}
                className="button-primary px-8 py-3 text-primary-text"
              >
                Update
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
/* <<<<<<<<===================================================== Dialog Faq Editor */

/* User subscriber detail modal ===========================================================>>>>> */
export const ModalSubscriberDetail: React.FC<ModalProps> = ({
  isOpen,
  close,
}) => {
  const [html, setHtml] = useState(
    `Students can engage with the AI tutor in several ways for a seamless learning experience. They can: Type their questions directly into the chat interface: This is ideal for quick queries and specific problems. Upload homework or problem sets as an image: Our AI will analyze the image, identify the problems, and allow students to work through them with guidance. Potentially speak their questions: Our voice input allows for an even more natural interaction. The AI will then analyze the student's input, highlight any errors, and provide step-by-step correct solutions with clear explanations. This ensures the student not only gets the right answer but also understands the underlying concepts.`
  );

  function onChange(e: ContentEditableEvent) {
    setHtml(e.target.value);
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => close()}
      className="relative z-50 transition duration-300 ease-out data-[closed]:opacity-0"
      transition={true}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/10" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className=" bg-primary p-4 rounded-lg shadow-xl min-w-lg">
          <div className="flex flex-col justify-center items-stretch">
            <div className="flex flex-col max-h-120 overflow-y-auto scrollbar-hide max-w-xl">
              <LabelInput
                label="Question"
                inputProps={{
                  placeholder: "Faq question",
                }}
              />
              <label htmlFor="text" className="mt-2 text-primary-text">
                Answer
              </label>

              <Editor
                id="text"
                value={html}
                onChange={onChange}
                containerProps={{
                  className: "max-h-200",
                }}
                className="w-full border-none outline-nonew-full p-3 bg-input text-primary-text font-poppins placeholder:font-poppins placeholder:text-input-placeholder rounded-md focus:outline-none focus:ring-0"
              >
                <Toolbar className="bg-blue-300 flex items-center [&_svg]:mx-auto">
                  <BtnStyles />
                  <BtnBold />
                  <BtnItalic />
                  <BtnBulletList />
                  <BtnNumberedList />
                  <BtnStrikeThrough />
                  <BtnLink />
                  <BtnUndo />
                  <BtnRedo />
                </Toolbar>
              </Editor>
            </div>
            <div className="mt-8 flex flex-row justify-center items-center gap-x-16">
              <button
                onClick={() => close()}
                className="button-primary px-8 py-3 text-primary-text"
              >
                Update
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
/* <<<<<<<<===================================================== User detail modal */

/* Add Subscriber Modal ===========================================================>>>>> */
export const ModalAddSubscriber: React.FC<ModalProps> = ({ isOpen, close }) => {
  type Inputs = {
    customer_name: string;
    restaurant_name: string;
    location: string;
    starting_date: string;
    phone_number: string;
    package: string;
    company_logo: FileList | undefined;
    email: string;
    password: string;
  };
  const { register, handleSubmit, watch, setValue } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };
  const logoFile: File | undefined = watch("company_logo")?.[0];
  return (
    <Dialog
      open={isOpen}
      onClose={() => close()}
      className="relative z-50 transition duration-300 ease-out data-[closed]:opacity-0"
      transition={true}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/10" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-xl rounded-xl bg-sidebar/80 p-6 backdrop-blur-xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
            <div className="flex flex-col justify-center items-stretch">
              <div className=" text-black rounded-xl shadow-lg w-full max-w-xl">
                <h2 className="text-2xl mb-6 text-center text-primary-text">
                  Information
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <LabelInput
                    label="Customer Name"
                    inputProps={{
                      id: "customer_name",
                      placeholder: "Kawsar Hossain",
                      ...register("customer_name"),
                    }}
                  />
                  <LabelInput
                    label="Restaurant Name"
                    inputProps={{
                      id: "restaurant_name",
                      ...register("restaurant_name"),
                    }}
                  />
                  <LabelInput
                    label="Location"
                    inputProps={{
                      id: "location",
                      ...register("location"),
                    }}
                  />
                  <DateInput
                    label="Starting Date"
                    inputProps={{
                      id: "starting_date",
                      ...register("starting_date"),
                    }}
                  />
                  <LabelInput
                    label="Phone Number"
                    inputProps={{
                      id: "phone_number",
                      ...register("phone_number"),
                    }}
                  />
                  <LabelInput
                    label="Package"
                    inputProps={{
                      id: "package",
                      ...register("package"),
                    }}
                  />
                  <PickCompanyLogo
                    file={logoFile}
                    label="Company Logo"
                    inputProps={{
                      id: "company_logo",
                      ...register("company_logo"),
                    }}
                    removeFile={() => setValue("company_logo", undefined)}
                  />
                  <LabelInput
                    label="Email"
                    inputProps={{
                      id: "email",
                      ...register("email"),
                    }}
                  />
                  <LabelInput
                    label="Password"
                    inputProps={{
                      id: "password",
                      ...register("password"),
                    }}
                  />
                  <div className="text-center mt-14 mb-6">
                    <button type="submit" className="button-primary px-14">
                      Add Subscriber
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
/* <<<<<<<<===================================================== Add Subscriber Modal */

/* Category Add/Edit Modal ===========================================================>>>>> */
type CategoryInputs = {
  name: string;
};

export const EditCategoryModal: React.FC<ModalProps> = ({
  isOpen,
  close,
  onSuccess,
}) => {
  const { fetchCategories } = useOwner();
  const { handleSubmit, register, reset } = useForm<CategoryInputs>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const onSubmit: SubmitHandler<CategoryInputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("Category_name", data.name);
      if (imageFile) formData.append("image", imageFile);

      const response = await axiosInstance.post(
        "/owners/categories/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      fetchCategories();
      console.log(response.data, "categories---------------");
      toast.success("Category Created successfully");
      reset();
      setImageFile(null);
      onSuccess();
      close();
    } catch (error) {
      console.error("Failed:", error);
      toast.error("An error occurred");
    }
  };
  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={close}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-xl rounded-xl bg-sidebar/80 p-6 backdrop-blur-xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle
              as="h3"
              className="text-base/7 font-medium text-white mb-8"
            >
              Add Category
            </DialogTitle>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-y-4"
            >
              <LabelInput
                label="Category Name"
                labelProps={{
                  className: "text-sm",
                }}
                inputProps={{
                  className: "bg-[#201C3F] shadow-md text-sm",
                  ...register("name"),
                }}
              />
              <InputImageUploadBox file={imageFile} setFile={setImageFile} />
              <button className="button-primary" onClick={close}>
                Submit
              </button>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

/* <<<<<<<<=====================================================  Category Add/Edit Modal */

/* Device Add/Edit Modal ===========================================================>>>>> */
export const EditDeviceModal: React.FC<ModalProps> = ({ isOpen, close }) => {
  const [loading, setLoading] = useState(false);
  const [tableName, setTableName] = useState("");
  const { fetchAllDevices, devicesSearchQuery, devicesCurrentPage } =
    useOwner();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("/owners/devices/", {
        table_name: tableName,
      });

      console.log("Response:", response.data);
      toast.success("Device added successfully!");

      // Refresh the devices list with current page and search query
      await fetchAllDevices(devicesCurrentPage, devicesSearchQuery);

      // Reset form and close modal
      setTableName("");
      close();
    } catch (error) {
      console.error("Error adding device:", error);
      toast.error("Failed to add device.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={close}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-xl rounded-xl bg-sidebar/80 p-6 backdrop-blur-xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle
              as="h3"
              className="text-base/7 font-medium text-white mb-8"
            >
              Add Device
            </DialogTitle>
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
              <LabelInput
                label="Name"
                labelProps={{
                  className: "text-sm",
                }}
                inputProps={{
                  className: "bg-[#201C3F] shadow-md text-sm text-white",
                  value: tableName,
                  onChange: (e) => setTableName(e.target.value),
                  required: true,
                }}
              />

              <button
                type="submit"
                className="button-primary"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

/* <<<<<<<<=====================================================  Device Add/Edit Modal  */

/* Edit staff ===========================================================>>>>> */
export const EditStaffModal: React.FC<ModalProps> = ({ isOpen, close }) => {
  type Inputs = {
    email: string;
    name: string;
    role: string;
  };
  const { register, handleSubmit, control } = useForm<Inputs>();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("username", data.name);
      formData.append("role", data.role);
      if (imageFile) formData.append("image", imageFile);

      const response = await axiosInstance.post(
        "/owners/chef-staff/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log(response.data);
      toast.success(`${response.data?.role} Created successfully`);
      close();
    } catch (error) {
      console.error("Failed:", error);
      toast.error(error.response?.data?.email || "An error occurred");
    }
    0;
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={close}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-xl rounded-xl bg-sidebar/80 p-6 backdrop-blur-xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle
              as="h3"
              className="text-base/7 font-medium text-white mb-8"
            >
              Create Member
            </DialogTitle>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-y-4"
            >
              <LabelInput
                label="Name"
                labelProps={{ className: "text-sm" }}
                inputProps={{
                  className: "bg-[#201C3F] shadow-md text-sm",
                  ...register("name"),
                }}
              />
              <LabelInput
                label="Email"
                labelProps={{ className: "text-sm" }}
                inputProps={{
                  className: "bg-[#201C3F] shadow-md text-sm",
                  ...register("email"),
                }}
              />
              <LabelInput
                label="Role"
                labelProps={{ className: "text-sm" }}
                inputProps={{
                  className: "bg-[#201C3F] shadow-md text-sm",
                  ...register("role"),
                }}
              />
              <InputImageUploadBox file={imageFile} setFile={setImageFile} />

              <button type="submit" className="button-primary">
                Submit
              </button>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

/* <<<<<<<<=====================================================  EditStaffModal Modal  */
