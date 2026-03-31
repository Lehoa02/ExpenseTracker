import React from "react";

const DeleteAlert = ({
    content,
    onDelete,
    primaryLabel = "Delete",
    secondaryLabel,
    onSecondaryAction,
    secondaryButtonLabel = "Stop sequence",
}) => {
    return (
        <div>
            <p className="text-sm">{content}</p>
            <div className="flex flex-wrap justify-end gap-3 mt-6">
                {secondaryLabel && onSecondaryAction && (
                    <button className="card-btn" type="button" onClick={onSecondaryAction}>
                        {secondaryButtonLabel}
                    </button>
                )}
                <button className="add-btn add-btn-fill" type="button" onClick={onDelete}>
                    {primaryLabel}
                </button>
            </div>
        </div>
    )
}

export default DeleteAlert