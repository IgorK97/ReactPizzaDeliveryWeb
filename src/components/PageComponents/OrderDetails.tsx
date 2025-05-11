import {
    Modal,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    CardMedia,
  } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
import HistoryOrder from "../../models/HistoryOrder";
import { IMAGE_BASE_URL } from "../../pathUtils/imagePath";
  
  interface OrderDetailsModalProps {
    order: HistoryOrder;
    open: boolean;
    onClose: () => void;
  }
  const RenameSize = (str:string)=>{
switch(str){
    case 'small':return 'маленькая';
    case 'medium':return 'средняя';
    case 'big':return 'большая';
    default:return str;
}
  }
  
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 600 },
    maxHeight: "90vh",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 2,
    overflow: "auto",
  };
  

  /**
   * Комопнент для отображения деталей о заказе
   * order - заказ, содержимое которого отображается в компоненте
   * open - состояние открытия
   * onClose - действие. совершаемое при закрытии компонента
   */
  export default function OrderDetails({
    order,
    open,
    onClose,
  }: OrderDetailsModalProps) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">
              Заказ №{order.id} - {order.status}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
  
          <List dense>
            {order.orderLines.map((item) => (
              <ListItem key={item.id} divider>
                <ListItemAvatar>
                    <CardMedia
                    component="img"
                    image={`${IMAGE_BASE_URL}${item.pizzaImage}`}
                    sx={{width:100,
                        height:100,
                        borderRadius:3,
                        objectFit:'cover',
                        mr:2
                    }}
                    alt={item.pizzaName}/>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      <Typography variant="body1" fontWeight="bold">
                        {item.pizzaName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {RenameSize(item.size)} ({item.weight}г)
                      </Typography>
                      {item.addedIngredients.length > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          +: {item.addedIngredients.join(", ")}
                        </Typography>
                      )}
                    </>
                  }
                  secondary={
                    <Typography variant="body2">
                      {item.quantity} × {item.price}₽ = {item.quantity * item.price}₽
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
  
          <Typography variant="h6" sx={{ mt: 2, textAlign: "right" }}>
            Итого: {order.orderLines.reduce((sum, item) => sum + item.price * item.quantity, 0)}₽
          </Typography>
        </Box>
      </Modal>
    );
  }