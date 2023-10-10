from flask import Flask, request, jsonify
from flask_cors import CORS


def get_imgstream(img_local_path):

    """
    工具函数:
    获取本地图片流
    :param img_local_path:文件单张图片的本地绝对路径
    :return: 图片流
    """
    import base64
    img_stream = ''
    with open(img_local_path, 'rb') as img_f:
        img_stream = img_f.read()
        # img_stream = base64.b64encode(img_stream).decode()
    return img_stream

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/')
def sayHello():
    return 'Hello Python'
@app.route('/getImg/', methods=['GET'])
def getImg():
    # 通过表单中name值获取图片
    # imgData = request.files["image"]
    # 设置图片要保存到的路径
    path = "./test/"
    print(path)
 
    # 获取图片名称及后缀名
    imgName = '0.png'
 
    # 图片path和名称组成图片的保存路径
    file_path = path + imgName
    print(file_path)
    # 保存图片
    # imgData.save(file_path)
 
    img_stream = get_imgstream(file_path)
    return img_stream

@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        image = request.files['image']
        if image:
            # 在这里处理接收到的图像数据，可以保存到服务器或进行其他操作
            # 例如，保存图像并返回成功响应
            image.save('./test/uploaded_image.jpg')
            return jsonify({'message': '上传成功'})
        else:
            return jsonify({'error': '没有上传图像'})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)