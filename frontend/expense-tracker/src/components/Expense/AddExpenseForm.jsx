import React from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddExpenseForm = ({ onAddExpense }) => {
    const [expense, setExpense] = React.useState({
        amount: '',
        category: '',
        date: '',
        icon: '',
    });

    const handleChange = (key, value) => { setExpense({ ...expense, [key]: value }) };
    

    return (
        <div>
            <EmojiPickerPopup 
            icon={expense.icon}
            onSelect={(selectedIcon) => handleChange("icon", selectedIcon)} />

            <Input 
            value={expense.category}
            onChange={(e) => handleChange("category", e.target.value)}
            placeholder="Rent, Groceries, etc." 
            label="Category" 
            type="text"/>

            <Input
            value={expense.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            placeholder="" 
            label="Amount" 
            type="number"/>

            <Input
            value={expense.date}
            onChange={(e) => handleChange("date", e.target.value)}
            placeholder="" 
            label="Date" 
            type="date"/>

            <div className="felx justidy-end mt-6">
                <button className="add-btn add-btn-fill" onClick={() => onAddExpense(expense)}>
                    Add Expense
                </button>
            </div>
        </div>
    )
}

export default AddExpenseForm;