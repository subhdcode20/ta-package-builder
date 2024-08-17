import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useTotalPackPrice = () => {
    const totalDayPrices = useSelector((state) => state.packBuilderData.totalDayPrices) || [];
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
    }, [totalDayPrices])

    return totalPackPrice;
}

export default useTotalPackPrice;