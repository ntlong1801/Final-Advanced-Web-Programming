import React, { useState, useRef, useMemo } from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import PropTypes from 'prop-types';
import { postFinalized } from 'apis/grade.api';
import { useMutation, useQuery } from 'react-query';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { useParams } from 'react-router';

import { isTeacherOfClass, getClassByID } from 'apis/class.api';

import io from 'socket.io-client';

const socket = io('http://localhost:5000');
const user = JSON.parse(localStorage.getItem('user_profile'));

export default function SwitchInput({ compositionId, isPublic }) {
  const { classId } = useParams();
  const [checked, setChecked] = useState(isPublic);
  const { mutate } = useMutation(postFinalized);
  const toast = useRef(null);

  const [visible, setVisible] = useState(false);
  // check is teacher
  const { data: _data } = useQuery({
    queryKey: ['class', classId],
    queryFn: () => getClassByID(classId),
  });
  useMemo(() => _data?.data ?? [], [_data]);
  const { data: checkTeacher } = useQuery({
    queryKey: [classId],
    queryFn: () => isTeacherOfClass(user?.id, classId),
  });
  const isTeacher = useMemo(() => checkTeacher?.data?.status !== 'false', [checkTeacher]);

  const handleChangeFinalized = async () => {
    mutate({ compositionId, isPublic }, {
      onSuccess: () => {
        setChecked(!checked);
        return true;
      },
      onError: () => false
    });
    // check role is teacher and emit notification
    if (isTeacher) {
      socket.emit('broadcastMessage', classId, `Teacher publiced grade composition for ${classId}`);
    }
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
