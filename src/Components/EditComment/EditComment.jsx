import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
export default function EditComment({ id, onClose }) {
  let queryclient = useQueryClient();
  let { register, handleSubmit } = useForm({
    defaultValues: {
      content: "",
    },
  });

  function controlEditing(values) {
    axios
      .put(`https://linked-posts.routemisr.com/comments/${id}`, values, {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      })
      .then((res) => {
        console.log(res);

        toast.success("Updated successfully");
        onClose(); // close after saving
        queryclient.invalidateQueries({ queryKey: ["userPosts"] });
        queryclient.invalidateQueries({queryKey:['singlePost']})
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to update comment");
      });
  }

  return (
    <div className="inset-0 flex bg-black/30 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="end-2.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <div className="p-4 md:p-5">
            <form className="space-y-4" onSubmit={handleSubmit(controlEditing)}>
              <div>
                <input
                  type="text"
                  {...register("content")}
                  placeholder="What's on your mind?"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-[#520B05] rounded-lg text-sm px-5 py-2.5"
              >
                Edit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
