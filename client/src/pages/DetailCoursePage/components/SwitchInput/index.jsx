import React, { useState, useRef } from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import PropTypes from 'prop-types';
import { postFinalized } from 'apis/grade.api';
import { useMutation } from 'react-query';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';

export default function SwitchInput({ compositionId, isPublic }) {
  const [checked, setChecked] = useState(isPublic);
  const { mutate } = useMutation(postFinalized);
  const toast = useRef(null);

  const [visible, setVisible] = useState(false);

  const handleChangeFinalized = async () => {
    mutate({ compositionId, isPublic }, {
      onSuccess: () => {
        setChecked(!checked);
        return true;
      },
      onError: () => false
    });
  };
  const footerContent = (
    <div>
      <Button label="No" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
      <Button
        label="Yes"
        icon="pi pi-check"
        onClick={() => {
          const rs = handleChangeFinalized();
          if (rs) {
            setVisible(false);
          }
        }}
        autoFocus
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />

      <div className="card flex justify-content-center">
        <InputSwitch
          id={compositionId}
          checked={checked}
          onChange={() => setVisible(true)}
          tooltip="Public grade"
          tooltipOptions={{ position: 'left' }}
        />
      </div>
      <Dialog header="Xác nhận" visible={visible} className="text-center" style={{ width: '20rem' }} onHide={() => setVisible(false)} footer={footerContent}>
        <p className="m-0">
          {!checked ?
            <Message severity="info" text="Do you want to public this grade?" />
            :
            <Message severity="info" text="Do you want to unPublic this grade?" />}
        </p>
      </Dialog>
    </>
  );
}

SwitchInput.propTypes = {
  compositionId: PropTypes.string,
  isPublic: PropTypes.bool.isRequired,
};

SwitchInput.defaultProps = {
  compositionId: '',
};
