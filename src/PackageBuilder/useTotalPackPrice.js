import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useTotalPackPrice = () => {
    const totalDayPrices = useSelector((state) => state.packBuilderData.totalDayPrices) || [];
    const finalTransferPrice = useSelector((state) => state.packBuilderData.finalTransferPrice) || 0;
    const [totalPackPrice, setTotalPackPrice] = useState(0);

    useEffect(() => {
        const isValid = totalDayPrices.every(i => i && i?.totalPrice && !isNaN(i?.totalPrice) );
        if(!isValid) {
            // TODO: entire form validation 
        }
        const totalPrice = totalDayPrices.reduce((acc, i) => {
            if(i && i?.totalPrice && !isNaN(i?.totalPrice)) {
                return acc + Number(i?.totalPrice);
            } else {
                return acc;
            }
        }, 0);
        setTotalPackPrice(totalPrice);
    }, [totalDayPrices, finalTransferPrice])

    return Number(totalPackPrice) + Number(finalTransferPrice);
}

export default useTotalPackPrice;