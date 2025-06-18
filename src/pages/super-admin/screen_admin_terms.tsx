import { MouseEvent, useState } from "react";
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

const ScreenAdminTermsAndCondition = () => {
  const [edit, setEdit] = useState(false);

  const [html, setHtml] = useState(`
     <ol className="flex flex-col gap-y-4 list-outside list-decimal">
            <li>
              A dialog is a type of modal window that appears in front of app
              content to provide critical information, or prompt for a decision
              to be made.A dialog is a type of modal window that appears in
              front of app content to provide critical information, or prompt
              for a decision to be made.A dialog is a type of modal window that
              appears in front of app content to provide critical information,
              or prompt for a decision to be made.
            </li>
            <li>
              A dialog is a type of modal window that appears in front of app
              content to provide critical information, or prompt for a decision
              to be made.A dialog is a type of modal window that appears in
              front of app content to provide critical information, or prompt
              for a decision to be made.
            </li>
            <li>
              A dialog is a type of modal window that appears in front of app
              content to provide critical information, or prompt for a decision
              to be made.A dialog is a type of modal window that appears in
              front of app content to provide critical information, or prompt
              for a decision to be made.A dialog is a type of modal window that
              appears in front of app content to provide critical information,
              or prompt for a decision to be made.A dialog is a type of modal
              window that appears in front of app content to provide critical
              information, or prompt for a decision to be made.A dialog is a
              type of modal window that appears in front of app content to
              provide critical information, or prompt for a decision to be made.
            </li>
            <li>
              A dialog is a type of modal window that appears in front of app
              content to provide critical information, or prompt for a decision
              to be made.A dialog is a type of modal window that appears in
              front of app content to provide critical information, or prompt
              for a decision to be made.A dialog is a type of modal window that
              appears in front of app content to provide critical information,
              or prompt for a decision to be made.
            </li>
            <li>
              A dialog is a type of modal window that appears in front of app
              content to provide critical information, or prompt for a decision
              to be made.A dialog is a type of modal window that appears in
              front of app content to provide critical information, or prompt
              for a decision to be made.A dialog is a type of modal window that
              appears in front of app content to provide critical information,
              or prompt for a decision to be made.
            </li>
            <li>
              A dialog is a type of modal window that appears in front of app
              content to provide critical information, or prompt for a decision
              to be made.A dialog is a type of modal window that appears in
              front of app content to provide critical information, or prompt
              for a decision to be made.
            </li>
            <li>
              A dialog is a type of modal window that appears in front of app
              content to provide critical information, or prompt for a decision
              to be made.A dialog is a type of modal window that appears in
              front of app content to provide critical information, or prompt
              for a decision to be made.
            </li>
          </ol>`);

  const onEditTerms = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEdit(true);
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
              className="button-primary bg-accent flex flex-row justify-center items-center py-2 gap-x-2"
            >
              <IconEdit color="#e1e8ff" /> <span>Edit</span>
            </button>
          ) : (
            <button
              onClick={() => setEdit(false)}
              className="button-primary bg-accent flex flex-row justify-center items-center py-2 gap-x-2"
            >
              <span>Update</span>
            </button>
          )}
        </div>
        <div className="h-10"></div>
        {!edit ? (
          <div
            className="[&_*]:list-auto text-primary-text/80 ps-8 list-decimal"
            dangerouslySetInnerHTML={{
              __html: html,
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
