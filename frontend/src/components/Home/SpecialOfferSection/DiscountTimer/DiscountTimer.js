import React, {useState,useEffect} from 'react'
import CSS from './DiscountTimer.module.css'

const DiscountTimer = () => {
  const [hours, setHours] = useState(10);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (hours === 0 && minutes === 0 && seconds === 0) {
        clearInterval(countdown);
      } else {
        if (minutes === 0 && seconds === 0) {
          setHours((prevHours) => prevHours - 1);
          setMinutes(59);
          setSeconds(59);
        } else if (seconds === 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          setSeconds(59);
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [hours, minutes, seconds]);

  return (
    <div className={CSS['discount-container']}>
      <div className={CSS['discount-data']}>
        <h6 className={CSS['discount-subtitle']}>Limited Time Offer</h6>
        <p className={CSS['discount-para']}>Ends soon</p>
        <div className={CSS['discount-time-container']}>
          <div className={CSS['discount-time']}>{String(hours).padStart(2, '0')}</div>
          <div className={CSS['discount-coln']}>:</div>
          <div className={CSS['discount-time']}>{String(minutes).padStart(2, '0')}</div>
          <div className={CSS['discount-coln']}>:</div>
          <div className={CSS['discount-time']}>{String(seconds).padStart(2, '0')}</div>
        </div>
        <div className={CSS['discount-time-text']}>
          <p className={CSS['discount-time-unit']} style={{marginLeft: 8}}>Hours</p>
          <p className={CSS['discount-time-unit']}>Minutes</p>
          <p className={CSS['discount-time-unit']}>Seconds</p>
        </div>
      </div>
    </div>
  );
};

export default DiscountTimer;
