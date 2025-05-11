import { ThumbDownAlt, ThumbUpAlt } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { useState } from "react";

/**
 * Интерфейс для типизации пропсов компонента DeliveryDialog
 */
interface DeliveryDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (status: boolean, comment: string) => void;
  }

  /**
   * Компонент для совершения доставки/недоставки курьером
   * @param {DeliveryDialogProps} props - фукнция подтверждения действия курьером, фукнция onClose, 
   * вызываемая при закрытии компонента, open - состояние открытия компонента
   * @returns 
   */
  export const DeliveryDialog:React.FC<DeliveryDialogProps>=({open, onClose, onSubmit})=>{
    const [deliveryStatus, setDeliveryStatus] = useState<boolean>(true);
    const [comment, setComment]=useState("");
    const handleSubmit=()=>{
        onSubmit(deliveryStatus, comment);
    }

    return (
<Dialog open={open} onClose={onClose}>
        <DialogTitle>Статус доставки</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400 }}>
            <FormControl fullWidth>

              <FormControl component="fieldset">
        <RadioGroup
          value={deliveryStatus ? "true" : "false"}
          onChange={(e) => setDeliveryStatus(e.target.value==="true")}
        >
          <FormControlLabel
            value="true"
            control={<Radio color="success" />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ThumbUpAlt
                 />
                <Typography>Успешно доставлен</Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="false"
            control={<Radio color="error" />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ThumbDownAlt />
                <Typography>Не доставлен</Typography>
              </Box>
            }
          />
        </RadioGroup>
      </FormControl>
             
            </FormControl>

            {deliveryStatus === false && (
              <TextField
                label="Причина недоставки"
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                variant="outlined"
                required
                fullWidth
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={deliveryStatus === false && comment.trim().length<20}
          >
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>
    )
  }


   