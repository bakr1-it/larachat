import TextAreaInput from "@/Components/TextAreaInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import UserPicker from "@/Components/UserPicker";
import { useForm, usePage } from "@inertiajs/react";
import { useEvent } from "@/context/EventBus";
import { useState, useEffect } from "react";

export default function GroupModal({ show = false, onClose = () => {} }) {
    const page = usePage();
    const conversations = page.props.conversations || [];
    const { on, emit } = useEvent();


    const [group, setGroup] = useState({});

    const { data, setData, post, errors, reset, processing, put } = useForm({
        id: "",
        name: "",
        description: "",
        user_ids: [],
    });

    // جلب المستخدمين الذين ليسوا مجموعات
    const users = conversations.filter((c) => !c.is_group);

    const groupUpdateOrCreate = (e) => {
        e.preventDefault();

        if (group.id) {
            put(route("group.update", group.id), {
                onSuccess: () => {
                    onCloseModal();
                    emit("toast.show", `group ${data.name} was updated`);
                },
            });
            return;
        }

        post(route("group.store"), {
            onSuccess: () => {
                onCloseModal();
                emit("toast.show", `group ${data.name} was created`);
            },
        });
    };


    const onCloseModal = () => {
        reset();
        setGroup({});
        onClose();
    };

    useEffect(() => {
        return on("GroupModal.show", (groupData = {}) => {
            setData({
                name: groupData.name || "",
                description: groupData.description || "",
                user_ids: (groupData.users || [])
                    .filter((u) => groupData.owner_id !== u.id)
                    .map((u) => u.id),
            });
            setGroup(groupData);
        });
    }, [on]);

    return (
        <Modal show={show} onClose={onCloseModal}>
            <form onSubmit={groupUpdateOrCreate} className="p-6 overflow-y-auto">
                <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                    {group.id
                        ? `Edit Group "${group.name}"`
                        : "Create new Group"}
                </h2>

                <div className="mt-8">
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full p-2"
                        value={data.name}
                        disabled={!!group.id}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="description" value="Description" />
                    <TextAreaInput
                        id="description"
                        rows="3"
                        className="mt-1 block w-full p-2"
                        value={data.description || ""}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.description} />
                </div>

                <div className="mt-4">
                    <InputLabel value="Select Users " />
                    <UserPicker
                        value={
                            users.filter(
                                (u) =>
                                    group?.owner_id !== u.id &&
                                    data.user_ids.includes(u.id)
                            ) || []
                        }
                        options={users}
                        onSelect={(selectedUsers) =>
                            setData(
                                "user_ids",
                                selectedUsers.map((u) => u.id)
                            )
                        }
                    />
                    <InputError className="mt-2" message={errors.user_ids} />
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onCloseModal}>
                        Cancel
                    </SecondaryButton>

                    <PrimaryButton className="ms-3" disabled={processing}>
                        {group.id ? "Update" : "Create"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
