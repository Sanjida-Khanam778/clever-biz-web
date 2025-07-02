import { MouseEvent, useState, useEffect } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnStyles,
  BtnUndo,
  ContentEditableEvent,
  Editor,
  EditorProvider,
  Toolbar,
} from "react-simple-wysiwyg";
import { IconEdit } from "../../components/icons";
import { useAdmin } from "../../context/adminContext";

const ScreenAdminTermsAndCondition = () => {
  const [edit, setEdit] = useState(false);
  const {
    termsAndConditions,
    isLoading,
    fetchTermsAndConditions,
    updateTermsAndConditions,
  } = useAdmin();

  const [html, setHtml] = useState("");

  // Fetch terms and conditions on component mount
  useEffect(() => {
    fetchTermsAndConditions();
  }, [fetchTermsAndConditions]);

  // Update local html state when terms and conditions is fetched
  useEffect(() => {
    if (termsAndConditions?.content) {
      setHtml(termsAndConditions.content);
    }
  }, [termsAndConditions]);

  const onEditTerms = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEdit(true);
  };

  const handleUpdate = async () => {
    try {
      await updateTermsAndConditions(html);
      setEdit(false);
    } catch (error) {
      // Error is handled in the context
      console.error("Failed to update terms and conditions");
    }
  };

  function onChange(e: ContentEditableEvent) {
    setHtml(e.target.value);
  }
  return (
    <EditorProvider>
      <div className="bg-sidebar text-black p-8 rounded-xl shadow-lg w-full">
        <div className="flex flex-row justify-between">
          <h2 className="mt-4 text-start text-primary-text text-2xl font-medium">
            Terms & Condition
          </h2>
          {!edit ? (
            <button
              onClick={() => setEdit(true)}
              disabled={isLoading}
              className="button-primary bg-accent flex flex-row justify-center items-center py-2 gap-x-2 disabled:opacity-50"
            >
              <IconEdit color="#e1e8ff" /> <span>Edit</span>
            </button>
          ) : (
            <button
              onClick={handleUpdate}
              disabled={isLoading}
              className="button-primary bg-accent flex flex-row justify-center items-center py-2 gap-x-2 disabled:opacity-50"
            >
              <span>{isLoading ? "Updating..." : "Update"}</span>
            </button>
          )}
        </div>
        <div className="h-10"></div>
        {isLoading && !termsAndConditions ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-primary-text">
              Loading terms and conditions...
            </div>
          </div>
        ) : !edit ? (
          <div
            className="[&_*]:list-auto text-primary-text/80 ps-8 list-decimal"
            dangerouslySetInnerHTML={{
              __html:
                html || "<p>No terms and conditions content available.</p>",
            }}
          />
        ) : (
          <div className="mt-4">
            <Editor
              id="text"
              value={html}
              onChange={onChange}
              containerProps={{
                className: "max-h-200",
              }}
              className="[&_*]:list-auto! w-full border-none outline-nonew-full p-3 bg-input text-primary-text font-poppins placeholder:font-poppins placeholder:text-input-placeholder rounded-md focus:outline-none focus:ring-0"
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
        )}
      </div>
    </EditorProvider>
  );
};

export default ScreenAdminTermsAndCondition;
