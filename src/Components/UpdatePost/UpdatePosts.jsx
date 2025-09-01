import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef} from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function UpdatePosts({ onClose, postId }) {
  let queryclient = useQueryClient();
  const userfileInput = useRef();

  let { register, handleSubmit } = useForm({
    defaultValues: {
      body: "",
      image: null,
    },
  });

  //  Validate & set image
  function handleuserImage(e) {
    const img = e.target.files[0];

    if (!img) return;
    if (img.size > 800 * 1024) {
      toast.error("Image size must be less than 800KB");
      userfileInput.current.value = ""; // reset input

      return;
    }

    if (!["image/jpeg", "image/jpg", "image/png"].includes(img.type)) {
      toast.error("Only JPG, JPEG, or PNG allowed");
      userfileInput.current.value = "";
      return;
    }

    
  }


  function controlEditing(values) {
    console.log("Form values:", values);

    let newData = new FormData();
    newData.append("body", values.body);

    newData.append("image", userfileInput.current.files[0]);

    axios
      .put(`https://linked-posts.routemisr.com/posts/${postId}`, newData, {
        headers: {
          token: localStorage.getItem("userToken"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        toast.success("Updated successfully");
        queryclient.invalidateQueries({ queryKey: ["userPosts"] });
        onClose();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to update post");
      });
  }

  return (
    <div className="inset-0 flex bg-black/30 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <button
              type="button"
              className="end-2.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          <div className="p-4 md:p-5">
            <form className="space-y-4" onSubmit={handleSubmit(controlEditing)}>
              <div>
                <input
                  type="text"
                  {...register("body")}
                  placeholder="What's on your mind?"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                />
              </div>

              <div>
                <i
                  onClick={() => userfileInput.current.click()}
                  className="fa-solid fa-image fa-2xl cursor-pointer"
                ></i>
                <input
                  type="file"
                  id="photo"
                  className="hidden"
                  {...register("image")}
                  ref={userfileInput}
                  onChange={handleuserImage}
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
