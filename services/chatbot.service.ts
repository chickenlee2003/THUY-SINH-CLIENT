import axios from 'axios';

// Định nghĩa interface cho message
export interface Message {
  sender: 'user' | 'bot';
  message: string;
}

// Định nghĩa interface cho response từ Rasa
interface RasaResponse {
  recipient_id: string;
  text?: string;
  image?: string;
  buttons?: Array<{
    title: string;
    payload: string;
  }>;
  custom?: Record<string, unknown>;
}

// URL của backend API
const BACKEND_API_URL = 'http://localhost:8080/api/v1/chatbot/message';

// Cấu hình Axios
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 giây timeout
});

/**
 * Service để giao tiếp với Rasa chatbot thông qua backend
 */
export class ChatbotService {
  /**
   * Gửi tin nhắn đến backend và nhận phản hồi
   * @param message Tin nhắn của người dùng
   * @param senderId ID của người gửi (có thể là session ID hoặc user ID)
   * @returns Promise chứa mảng các phản hồi từ bot
   */
  static async sendMessage(message: string, senderId: string = 'default'): Promise<Message[]> {
    try {
      console.log(`Sending message to backend: ${message} (sender: ${senderId})`);
      
      const response = await axiosInstance.post(BACKEND_API_URL, {
        sender: senderId,
        message: message
      });

      console.log('Response from backend:', response.data);
      
      // Kiểm tra nếu response.data là mảng
      if (!Array.isArray(response.data)) {
        console.error('Unexpected response format:', response.data);
        return [{
          sender: 'bot',
          message: 'Xin lỗi, có lỗi định dạng phản hồi từ hệ thống.'
        }];
      }

      // Chuyển đổi phản hồi từ Rasa thành định dạng Message
      const botMessages: Message[] = [];
      
      for (const rasaResponse of response.data as RasaResponse[]) {
        // Xử lý tin nhắn văn bản
        if (rasaResponse.text) {
          let messageText = rasaResponse.text;
          
          // Xử lý nếu có buttons
          if (rasaResponse.buttons && rasaResponse.buttons.length > 0) {
            messageText += '\n\nCác lựa chọn:';
            rasaResponse.buttons.forEach((button: { title: string; payload: string }) => {
              messageText += `\n- ${button.title}`;
            });
          }
          
          botMessages.push({
            sender: 'bot',
            message: messageText
          });
        }
        
        // Xử lý hình ảnh riêng biệt
        if (rasaResponse.image) {
          botMessages.push({
            sender: 'bot',
            message: `[Hình ảnh:${rasaResponse.image}]`
          });
        }
      }

      return botMessages.length > 0 ? botMessages : [{
        sender: 'bot',
        message: 'Xin lỗi, tôi không hiểu yêu cầu của bạn. Bạn có thể diễn đạt lại được không?'
      }];
    } catch (error) {
      console.error('Error communicating with backend:', error);
      
      // Kiểm tra loại lỗi để hiển thị thông báo phù hợp
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          return [{
            sender: 'bot',
            message: 'Kết nối đến hệ thống quá thời gian chờ. Vui lòng thử lại sau.'
          }];
        }
        
        if (error.response) {
          console.error('Error response:', error.response.data);
          return [{
            sender: 'bot',
            message: `Lỗi từ hệ thống (${error.response.status}). Vui lòng thử lại sau.`
          }];
        }
        
        if (error.request) {
          return [{
            sender: 'bot',
            message: 'Không thể kết nối đến hệ thống. Vui lòng kiểm tra kết nối mạng và thử lại.'
          }];
        }
      }
      
      return [{
        sender: 'bot',
        message: 'Xin lỗi, có lỗi xảy ra khi kết nối với hệ thống. Vui lòng thử lại sau.'
      }];
    }
  }

  /**
   * Gửi yêu cầu khởi tạo cuộc trò chuyện đến Rasa
   * @param senderId ID của người gửi
   * @returns Promise chứa tin nhắn chào từ bot
   */
  static async initializeChat(senderId: string = 'default'): Promise<Message[]> {
    try {
      // Gửi một tin nhắn chào để khởi tạo cuộc trò chuyện
      return await this.sendMessage('/greet', senderId);
    } catch (error) {
      console.error('Error initializing chat:', error);
      return [{
        sender: 'bot',
        message: 'Chào mừng bạn đến với Kolathur Fish Market! Tôi có thể giúp gì cho bạn?'
      }];
    }
  }
}

export default ChatbotService;
