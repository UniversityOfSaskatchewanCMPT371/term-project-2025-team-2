


export const NewTagRow = () => {
    
    return (
        <tr>
            <td  className="border px-4 py-2 text-center">
                <input
                    type="text"
                    className="w-full"
                    placeholder="Tag ID"
                />
            </td>
            <td  className="border px-4 py-2 text-center">
                <input
                    type="text"
                    className="w-full"
                    placeholder="Tag Name"
                />
            </td>
            <td  className="border px-4 py-2 text-center">
                <input
                    type="text"     
                    className="w-full"
                    placeholder="Tag Value"
                />
            </td>
        </tr>
    )

};
