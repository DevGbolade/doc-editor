/* eslint-disable @typescript-eslint/no-explicit-any */
import useSessionStorage from "@/hooks/useSessionStorage";
import { authService } from "@/services/auth/auth.service";
import { documentService } from "@/services/auth/document.service";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Modal({ open, setOpen }: any) {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const document = useSessionStorage("doc", "get");
  const getAllUsers = async () => {
    try {
      const {
        data: { users },
      } = await authService.getAllUsers();
      setUsers(users);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const AddCollaborator = async (docId: string, userId: string) => {
    try {
      const { data } = await documentService.addCollaboratorToDoc({
        docId,
        userId,
      });
      toast.success(data?.message ?? "User added as collaborator successfully");
      setUserId("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ??
          "Error, unable to add user as collaborator"
      );

      console.log("Error", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <Transition show={open}>
      <Dialog className="relative z-10" onClose={setOpen}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Add user as Collaborators
                    </DialogTitle>
                    <div className="flex flex-col items-start justify-start mt-7">
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Collaborator:
                      </label>
                      <select
                        id="location"
                        name="location"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                      >
                        <option selected value="">
                          select a user
                        </option>
                        {users.map(
                          ({
                            username,
                            _id,
                          }: {
                            username: string;
                            _id: string;
                          }) => (
                            <option key={_id} value={_id}>
                              {username}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 flex gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full text-gray-500 border  justify-center rounded-md bg- px-3 py-2 text-sm font-semibold  shadow-sm hover:bg--500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => {
                      setUserId("");
                      setOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => {
                      AddCollaborator(document._id, userId);
                      setOpen(false);
                    }}
                  >
                    Add user
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
