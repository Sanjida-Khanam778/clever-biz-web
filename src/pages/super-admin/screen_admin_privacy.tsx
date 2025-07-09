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

const ScreenAdminPrivacy = () => {
  const [edit, setEdit] = useState(false);
  const { privacyPolicy, isLoading, fetchPrivacyPolicy, updatePrivacyPolicy } =
    useAdmin();
  console.log(privacyPolicy);
  const [html, setHtml] = useState("");

  // Fetch privacy policy on component mount
  useEffect(() => {
    fetchPrivacyPolicy();
  }, [fetchPrivacyPolicy]);

  // Update local html state when privacy policy is fetched
  useEffect(() => {
    if (privacyPolicy?.length && privacyPolicy[0]?.text) {
      setHtml(privacyPolicy[0].text);
    }
  }, [privacyPolicy]);

  const onEditTerms = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEdit(true);
  };

  const handleUpdate = async () => {
    try {
      await updatePrivacyPolicy(privacyPolicy[0].id, html);
      setEdit(false);
    } catch (error) {
      // Error is handled in the context
      console.error("Failed to update privacy policy");
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
            Privacy Policy
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
        {isLoading && !privacyPolicy ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-primary-text">Loading privacy policy...</div>
          </div>
        ) : !edit ? (
          <div
            className="[&_*]:list-auto text-primary-text/80 ps-8 list-decimal"
            dangerouslySetInnerHTML={{
              __html: html || "<p>No privacy policy content available.</p>",
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

export default ScreenAdminPrivacy;
