const Signature = class {
  constructor() {
    this.type = "";
    this.canvas = $('#signatureCanvas')[0];
    this.ctx = this.canvas.getContext('2d');
    this.position = { x: 0, y: 0 };
    this.painting = false;
  }

  initialize = () => {
    $(document).ready(() => {
      this.bindCanvasEvents();
      this.bindTouchEvents();
      this.bindInputChange();
      this.bindSignatureTypeToggle();
    });
  }

  bindCanvasEvents = () => {
    $(this.canvas).mousedown(this.startPainting);
    $(this.canvas).mouseup(this.stopPainting);
    $(this.canvas).mousemove(this.sketch);
  }

  bindTouchEvents = () => {
    $(this.canvas).on("touchend", (event) => this.handleTouch(event, "mouseup"));
    $(this.canvas).on("touchstart", (event) => this.handleTouch(event, "mousedown"));
    $(this.canvas).on("touchmove", (event) => this.handleTouch(event, "mousemove"));
  }

  bindInputChange = () => {
    $('#signatureField').change(() => {
      console.log("Change triggered!");
      const file = $('#signatureField').prop("files")[0];
      if (!file) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.addEventListener("load", () => {
        $('#signaturePreview')
          .attr("src", reader.result)
          .css({ display: 'inline' });
      });
    });
  }

  bindSignatureTypeToggle = () => {
    $('input[name=signatureType]').change(this.handleSignatureTypeChange);
  }

  handleSignatureTypeChange = () => {
    this.type = $('input[name=signatureType]:checked').val();
    if (this.type === "DRAW") {
      $('#signatureCanvasWrapper').show();
      $('#signatureSelect').hide();
    } else if (this.type === "SELECT") {
      $('#signatureSelect').show();
      $('#signatureCanvasWrapper').hide();
    }
  }

  handleTouch = (event, type) => {
    event.preventDefault();
    const touch = event.touches[0];
    const mouseEvent = new MouseEvent(type, {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    this.canvas.dispatchEvent(mouseEvent);
  }

  getSignatureImage = () => {
    return this.type === "DRAW"
      ? this.canvas.toDataURL("image/png")
      : $('#signaturePreview').attr("src");
  }

  getPosition = (event) => {
    this.position.x = event.clientX - this.canvas.getBoundingClientRect().left;
    this.position.y = event.clientY - this.canvas.getBoundingClientRect().top;
  }

  startPainting = (event) => {
    this.painting = true;
    this.getPosition(event);
  }

  stopPainting = () => {
    this.painting = false;
  }

  sketch = (event) => {
    if (!this.painting) return;

    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = "black";

    this.ctx.moveTo(this.position.x, this.position.y);
    this.getPosition(event);
    this.ctx.lineTo(this.position.x, this.position.y);
    this.ctx.stroke();
  }

  clearCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  clearPreview = () => {
    $('#signaturePreview').attr("src", "#");
  }

  isBlank = () => {
    const data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
    return !data.some(channel => channel !== 0);
  }
}
