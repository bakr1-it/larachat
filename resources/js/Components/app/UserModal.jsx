
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import Checkbox from '@/Components/Checkbox';
import { useForm, usePage } from "@inertiajs/react";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";
import { useEvent } from "@/context/EventBus";

export default function GroupModal({ show = false, onClose = () => {} }) {

const {emit}= useEvent();
    const { data, setData, post, errors, reset, processing } = useForm({
        name: "",
        email: "",
        is_admin: false,
    });
const onSubmit = (e)=>{
   e.preventDefault();
    post(route("user.store"),{
        onSuccess :()=>{
            onCloseModal();
            emit("toast.show",`create new user is success ${data.name}` )

        }
    });

}




    const onCloseModal = () => {
        reset();

        onClose();
    };


    return (
        <Modal show={show} onClose={onCloseModal} >
            <form onSubmit={onSubmit} className="p-6 overflow-y-auto m-auto ">
                <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                    Create New User
                </h2>

                <div className="mt-8">
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full p-2"
                        value={data.name}
                        name="name"

                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>
                <div className="mt-8">
                    <InputLabel htmlFor="Email" value="Email" />
                    <TextInput
                        id="Email"
                        className="mt-1 block w-full p-2"
                        value={data.email}
                        name="email"

                        onChange={(e) => setData("email", e.target.value)}
                        required

                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>
                                <div className="mt-4 block">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.is_admin}
                                            onChange={(e) =>
                                                setData('is_admin', e.target.checked)
                                            }
                                        />
                                        <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                                            Is Admin
                                        </span>
                                    </label>
                                </div>
                               <div className="mt-6 flex justify-end">
                                                 <SecondaryButton onClick={onCloseModal}>
                                                     Cancel
                                                 </SecondaryButton>

                                                 <PrimaryButton className="ms-3" disabled={processing}>
                                                     Create
                                                 </PrimaryButton>
                                             </div>
            </form>
        </Modal>
    );
}
