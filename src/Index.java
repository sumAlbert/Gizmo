import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class Index extends HttpServlet {
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String command=(String) req.getParameter("command");
        String userId=(String) req.getParameter("userId");
        String sceneId=(String) req.getParameter("sceneId");
        PrintWriter printWriter=resp.getWriter();
        switch (command){
            default:
                printWriter.print("456456");
                printWriter.close();
                break;
        }
    }
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req,resp);
    }
}
